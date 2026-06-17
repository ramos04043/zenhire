from cryptography.fernet import Fernet
from app.config import settings
import base64

class EncryptionService:
    # In a real app, this key should be in environment variables
    # For demo purposes, we derive it from JWT_SECRET or use a placeholder
    _key = base64.urlsafe_b64encode(settings.JWT_SECRET[:32].ljust(32).encode())
    _fernet = Fernet(_key)

    @classmethod
    def encrypt(cls, data: str) -> str:
        if not data:
            return data
        return cls._fernet.encrypt(data.encode()).decode()

    @classmethod
    def decrypt(cls, encrypted_data: str) -> str:
        if not encrypted_data:
            return encrypted_data
        try:
            return cls._fernet.decrypt(encrypted_data.encode()).decode()
        except Exception:
            # Fallback for unencrypted data during transition
            return encrypted_data
