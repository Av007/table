from django.http import JsonResponse
from rest_framework import filters, generics
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Product
from .serializers import ProductSerializer, CustomTokenObtainPairSerializer


def health_check(request):
    return JsonResponse({"status": "ok"}, status=200)

class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all().only('id', 'name')
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'stock', 'price']

class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
