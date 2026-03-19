from django.urls import re_path

from .consumer import BackgroundTaskConsumer

background_tasks_ws_urlpatterns = [
    re_path(r"ws/background-task/", BackgroundTaskConsumer.as_asgi()),
]
