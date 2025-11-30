
from rest_framework.response import Response
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
# from djoser.social.views import ProviderAuthView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)



def set_cookie_internal(response, key):
    # print(type(response))
    if response is None:
        # print("Response is None")
        return None
    
    match key:
        case settings.AUTH_COOKIE_ACCESS_KEY:
            max_age = settings.AUTH_COOKIE_ACCESS_MAX_AGE
            token = response.data.get('access')
            # print(f"Access token: {token}")
        
        case settings.AUTH_COOKIE_REFRESH_KEY:
            max_age = settings.AUTH_COOKIE_REFRESH_MAX_AGE
            token = response.data.get('refresh')
            # print(f"Refresh token: {token}")
            
        case _:
            raise TokenError("Unknown type of token")
            
    if token:
        response.set_cookie(
            key=key,
            value=token,
            max_age=max_age,
            path=settings.AUTH_COOKIE_PATH,
            secure=settings.AUTH_COOKIE_SECURE,
            httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            samesite=settings.AUTH_COOKIE_SAMESITE
        )

    return response


# class CustomProviderAuthView(ProviderAuthView):
#     def post(self, request, *args, **kwargs):
#         response = super().post(request, *args, **kwargs)

#         if response.status_code == status.HTTP_201_CREATED:
#             access_token = response.data.get('access')
#             refresh_token = response.data.get('refresh')

#             # set access token as cookie
#             # response.set_cookie(
#             #     settings.AUTH_COOKIE_ACCESS_KEY,
#             #     access_token,
#             #     max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
#             #     path=settings.AUTH_COOKIE_PATH,
#             #     secure=settings.AUTH_COOKIE_SECURE,
#             #     httponly=settings.AUTH_COOKIE_HTTP_ONLY,
#             #     samesite=settings.AUTH_COOKIE_SAMESITE
#             # )
#             # response.set_cookie(
#             #     settings.AUTH_COOKIE_REFRESH_KEY,
#             #     refresh_token,
#             #     max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
#             #     path=settings.AUTH_COOKIE_PATH,
#             #     secure=settings.AUTH_COOKIE_SECURE,
#             #     httponly=settings.AUTH_COOKIE_HTTP_ONLY,
#             #     samesite=settings.AUTH_COOKIE_SAMESITE
#             # )
            
            

#         return response


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs) -> Response:
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            # access_token = response.data.get('access')
            # refresh_token = response.data.get('refresh')

            # response.set_cookie(
            #     AUTH_COOKIE_ACCESS_KEY,
            #     access_token,
            #     max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
            #     path=settings.AUTH_COOKIE_PATH,
            #     secure=settings.AUTH_COOKIE_SECURE,
            #     httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            #     samesite=settings.AUTH_COOKIE_SAMESITE
            # )
            # response.set_cookie(
            #     AUTH_COOKIE_REFRESH_KEY,
            #     refresh_token,
            #     max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
            #     path=settings.AUTH_COOKIE_PATH,
            #     secure=settings.AUTH_COOKIE_SECURE,
            #     httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            #     samesite=settings.AUTH_COOKIE_SAMESITE
            # )
            response = set_cookie_internal(response, settings.AUTH_COOKIE_ACCESS_KEY)
            response = set_cookie_internal(response, settings.AUTH_COOKIE_REFRESH_KEY)
            
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs) -> Response:
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH_KEY)

        if refresh_token:
            request.data['refresh'] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            # access_token = response.data.get('access')

            # response.set_cookie(
            #     'access',
            #     access_token,
            #     max_age=settings.AUTH_COOKIE_MAX_AGE,
            #     path=settings.AUTH_COOKIE_PATH,
            #     secure=settings.AUTH_COOKIE_SECURE,
            #     httponly=settings.AUTH_COOKIE_HTTP_ONLY,
            #     samesite=settings.AUTH_COOKIE_SAMESITE
            # )
            response = set_cookie_internal(response, settings.AUTH_COOKIE_ACCESS_KEY)

        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH_KEY)

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        response: Response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(settings.AUTH_COOKIE_ACCESS_KEY)
        response.delete_cookie(settings.AUTH_COOKIE_REFRESH_KEY)

        return response