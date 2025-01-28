from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["custom_field"] = "Custom value"

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user
        # data["user_id"] = user.id
        data["email"] = user.email

        return data
