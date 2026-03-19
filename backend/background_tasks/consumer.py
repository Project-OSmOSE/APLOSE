import json

from asgiref.sync import async_to_sync
from celery.worker.control import revoke
from channels.generic.websocket import WebsocketConsumer
from django.core.serializers.json import DjangoJSONEncoder
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.tokens import AccessToken

from backend.aplose.models import User
from backend.background_tasks.models import BackgroundTask
from backend.background_tasks.tasks import process_background_task


class BackgroundTaskConsumer(WebsocketConsumer):

    # Manage connection

    is_authorized: bool = False

    def connect(self):
        """
        Handle websocket connection
        """
        # User.
        token = self.scope.get("cookies").get("token")
        if token:
            user_id = AccessToken(token).get("user_id")
            user = User.objects.get(pk=user_id)
            if not (user.is_staff or user.is_superuser):
                self.close()
        else:
            self.close()

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
            - command: 'add' or 'cancel' or 'pause' or 'resume' or 'retry'
            - task_id: id of the background task
        """
        try:
            data = json.loads(text_data)
            print("receive", data)
            command = data.get("command")

            if command == "add":
                self.handle_add(task_id=data.get("task_id"))
            elif command == "cancel":
                self.handle_cancel(task_id=data.get("task_id"))
            elif command == "pause":
                self.handle_pause(task_id=data.get("task_id"))
            elif command == "resume":
                self.handle_resume(task_id=data.get("task_id"))
            elif command == "retry":
                self.handle_retry(task_id=data.get("task_id"))

        except json.JSONDecodeError:
            self.send_error("Invalid JSON")

    # Handle actions

    def handle_add(self, task_id: int | str):
        """
        Handle 'add' command from WebSocket.
        """
        try:
            task = BackgroundTask.objects.get(pk=task_id)
            async_to_sync(self.channel_layer.group_add)(
                task.get_ws_group_name(), self.channel_name
            )
            # Send current import status immediately
            self.send(dict_data=task.get_ws_update_data())
        except BackgroundTask.DoesNotExist:
            self.send_error(f"Task {task_id} does not exist")

    # TODO: cancel celery task as well!!
    def handle_cancel(self, task_id: int | str):
        """
        Handle 'cancel' command from WebSocket.
        """
        try:
            task = BackgroundTask.objects.get(pk=task_id)
            revoke(task_id=task.celery_id)
            async_to_sync(self.channel_layer.group_discard)(
                task.get_ws_group_name(), self.channel_name
            )
        except BackgroundTask.DoesNotExist:
            self.send_error(f"Task {task_id} does not exist")

    # TODO: pause celery task as well!! to check
    def handle_pause(self, task_id: int | str):
        """
        Handle 'pause' command from WebSocket.
        """
        try:
            task = BackgroundTask.objects.get(pk=task_id)
            revoke(task_id=task.celery_id)
            task.pause()
            async_to_sync(self.channel_layer.group_discard)(
                task.get_ws_group_name(), self.channel_name
            )
            # Send current import status immediately
            self.send(dict_data=task.get_ws_update_data())
        except BackgroundTask.DoesNotExist:
            self.send_error(f"Task {task_id} does not exist")

    # TODO: resume celery task as well!! to check
    def handle_resume(self, task_id: int | str):
        """
        Handle 'resume' command from WebSocket.
        """
        try:
            task = BackgroundTask.objects.get(pk=task_id)
            task.resume()
            async_to_sync(self.channel_layer.group_add)(
                task.get_ws_group_name(), self.channel_name
            )
            # Send current import status immediately
            self.send(dict_data=task.get_ws_update_data())
            process_background_task.delay(task_id=task.pk)
        except BackgroundTask.DoesNotExist:
            self.send_error(f"Task {task_id} does not exist")

    # TODO: retry celery task as well!! to check
    def handle_retry(self, task_id: int | str):
        """
        Handle 'retry' command from WebSocket.
        """
        try:
            task = BackgroundTask.objects.get(pk=task_id)
            new_task = BackgroundTask.objects.create(
                type=task.type,
                additional_info=task.additional_info,
            )
            new_task.additional_info["error"] = None
            new_task.additional_info["error_traceback"] = None
            new_task.save()
            async_to_sync(self.channel_layer.group_add)(
                new_task.get_ws_group_name(), self.channel_name
            )
            # Send current import status immediately
            self.send(
                dict_data={
                    "type": "background_task_retry",
                    "data": {
                        "old_task_id": task_id,
                        "new_task_id": new_task.pk,
                    },
                }
            )
        except BackgroundTask.DoesNotExist:
            self.send_error(f"Task {task_id} does not exist")

    # Send info

    def send_error(self, message: str):
        """
        Send error message to client.
        """
        self.send(dict_data={"type": "error", "message": message})

    def send(self, text_data=None, bytes_data=None, dict_data=None, close=False):
        if dict_data is not None:
            return super().send(text_data=json.dumps(dict_data, cls=DjangoJSONEncoder))
        return super().send(text_data, bytes_data, close)

    def background_task_update(self, event):
        """
        Receive background task update from channel layer and send to WebSocket.
        """
        return self.send(text_data=json.dumps(event["data"], cls=DjangoJSONEncoder))
