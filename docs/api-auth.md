# Auth API

## POST /auth/send-code
Отправляет SMS-код на номер телефона.

### Request
{
  "phone": "+79991234567"
}

### Response 200
{
  "success": true,
  "cooldownSec": 60,
  "ttlSec": 300
}

### Errors
- 400 invalid_phone
- 429 too_many_requests
- 500 provider_error

## POST /auth/verify-code
Проверяет код из SMS.

### Request
{
  "phone": "+79991234567",
  "code": "1234"
}

### Response 200
{
  "accessToken": "jwt-access",
  "refreshToken": "jwt-refresh",
  "expiresIn": 3600,
  "user": {
    "id": "u_123",
    "phone": "+79991234567",
    "isNewUser": true
  }
}

### Errors
- 400 invalid_code
- 410 code_expired
- 429 too_many_attempts

## POST /auth/refresh
Обновляет access token.

### Request
{
  "refreshToken": "jwt-refresh"
}

### Response 200
{
  "accessToken": "jwt-access-new",
  "expiresIn": 3600
}

## Требования
- TTL кода: 5 минут
- повторная отправка не чаще 60 секунд
- лимит неверных попыток: 5
- логирование auth-событий обязательно
