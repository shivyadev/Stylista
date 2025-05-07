from django.urls import path
from .views import test, store_items, get_items, get_item_from_id

urlpatterns = [
    path("test/", test, name="test"),
    path("store-items/", store_items, name="store_items"),
    path("get-items/", get_items, name="get_items"),
    path("item/<int:item_id>/", get_item_from_id, name="item")
]
