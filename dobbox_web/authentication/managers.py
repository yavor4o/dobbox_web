from django.contrib import auth
from django.contrib.auth.models import BaseUserManager



class DobboxUserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra_fields):

        if not email:
            raise ValueError('Имейл адресът е задължителен')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):

        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Суперпотребителят трябва да има is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Суперпотребителят трябва да има is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

    def with_perm(self, perm, is_active=True, include_superusers=True, backend=None, obj=None):

        if backend is None:
            backends = auth._get_backends(return_tuples=True)
            if len(backends) == 1:
                backend, _ = backends[0]
            else:
                raise ValueError(
                    "Имате конфигурирани множество аутентикационни бекенди и "
                    "затова трябва да предоставите аргумент 'backend'."
                )
        elif not isinstance(backend, str):
            raise TypeError(
                "backend трябва да бъде низ с път за вмъкване (получено %r)." % backend
            )
        else:
            backend = auth.load_backend(backend)
        if hasattr(backend, "with_perm"):
            return backend.with_perm(
                perm,
                is_active=is_active,
                include_superusers=include_superusers,
                obj=obj,
            )
        return self.none()
