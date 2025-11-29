from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin


class UserAccountManager(BaseUserManager):
    def _create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email, and password.
        """
        if not email:
            raise ValueError("Users must have an email address")

        email=self.normalize_email(email)
        email = email.lower()
        
        user = self.model(email=email,**extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("is_active", False)  # new users need admin approval
        
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Creates and saves a superuser with the given email, and password.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True")
                
        return self._create_user(email, password, **extra_fields)


class UserAccount(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=255)
    last_name  = models.CharField(max_length=255)
    email = models.EmailField(unique=True, verbose_name="email address", max_length=255)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return self.email
