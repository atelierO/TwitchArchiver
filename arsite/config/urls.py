from django.urls import path

from . import views

urlpatterns = [
    path('', views.index),

    path('change_oauth', views.change_oauth),
    path('register', views.register),
    path('delete_channel', views.delete_channel),
    path('download_channel', views.download_channel),
    path('download_state', views.download_state)
]