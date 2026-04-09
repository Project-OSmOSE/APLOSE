import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework_simplejwt.tokens import AccessToken

from backend.aplose.models import User
from backend.background_tasks.tasks import process_background_task
from backend.background_tasks.types import get_task


class BackgroundTaskConsumer(WebsocketConsumer):

    # Manage connection

    def connect(self):
        """
        Handle websocket connection
        """
        self.accept()

    def disconnect(self, code):
        """
        Handle websocket disconnection
        """
        for group in self.groups:
            async_to_sync(self.channel_layer.group_discard)(group, self.channel_name)

    # Receive info

    def receive(self, text_data=None, bytes_data=None):
        """
        Handle messages from WebSocket.

        Params:
            - command: 'subscribe', 'unsubscribe' or 'cancel' or 'retry'
            - identifier: identifier of the background task
            - token: identify user
        """
        try:
            data = json.loads(text_data)

            # Check token
            token = data.get("token")
            if not token:
                return self.send_error("Missing token")
            user_id = AccessToken(token).get("user_id")
            user = User.objects.get(pk=user_id)
            if not (user.is_staff or user.is_superuser):
                return self.send_error("Not allowed")

            command = data.get("command")

            # Base subscription commands
            if command == "subscribe":
                self.handle_subscribe(identifier=data.get("identifier"))
            elif command == "unsubscribe":
                self.handle_unsubscribe(identifier=data.get("identifier"))

            elif command == "retry":
                self.handle_retry(identifier=data.get("identifier"))

        except json.JSONDecodeError:
            self.send_error("Invalid JSON")

    # Handle subscription actions

    def handle_subscribe(self, identifier: str):
        """
        Handle 'add' command from WebSocket.
        """
        try:
            _, task = get_task(identifier)
            async_to_sync(self.channel_layer.group_add)(task.uuid, self.channel_name)
            # Send current import status immediately
            self.send_data(type="info", identifier=identifier, data=task.to_dict())
        except User.DoesNotExist as e:
            self.send_error(f"Fail recovering task: {e}")

    def handle_unsubscribe(self, identifier: str):
        """
        Handle 'remove' command from WebSocket.
        """
        _, _, uuid = identifier.split(":")
        async_to_sync(self.channel_layer.group_discard)(uuid, self.channel_name)

    # Handle other actions

    def handle_retry(self, identifier: str):
        """
        Handle 'retry' command from WebSocket.
        """
        try:
            _, task = get_task(identifier)
            process_background_task.delay(task.identifier)
        except User.DoesNotExist as e:
            self.send_error(f"Fail recovering task: {e}")

    # Send info

    def send_error(self, message: str):
        """
        Send error message to client.
        """
        self.send(text_data=json.dumps({"type": "error", "message": message}))

    def send_data(self, type: "info", identifier: str, data: dict):
        """
        Send task data message to client.
        """
        self.send(
            text_data=json.dumps({"type": type, "identifier": identifier, "data": data})
        )

    # From task
    def info(self, event):
        """
        Receive background task update from channel layer and send to WebSocket.
        type: 'info'
        """
        return self.send(text_data=json.dumps(event, cls=DjangoJSONEncoder))
