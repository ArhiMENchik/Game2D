DATE_FORMAT = '%Y-%m-%d'
DATETIME_FORMAT = '%Y-%m-%d %H:%M'
DATETIME_SEC_FORMAT = '%Y-%m-%d %H:%M:%S'
TIME_FORMAT = '%H:%M:%S'
TIME_SHORT_FORMAT = '%H:%M'
DATETIME_FORMAT_FULL = '%Y-%m-%d %H:%M:%S.%f%z'


class DataKeys:
    SUCCESS = 'success'
    SUCCESS_b = SUCCESS.encode()

    MESSAGE = 'message'
    MESSAGE_b = MESSAGE.encode()

    RESULT = 'result'
    RESULT_b = RESULT.encode()

    ERRORS = 'errors'

    SUCCESS_RESPONSE_PREFIX = b'{"' + SUCCESS_b + b'":true,"' + RESULT_b + b'":'
    SUCCESS_RESPONSE_POSTFIX = b'}'

    CLIENT_UUID = 'client_uuid'

    CODE = 'code'

    ACTION = 'action'
    FROM = 'from'
    TO = 'to'
    DATA = 'data'
    REPLY_TO = 'reply_to'
    CORRELATION_ID = 'correlation_id'

    QUEUE = 'queue'
    SEQUENCE_NUMBER = 'sequence_number'
    SEQUENCE_SENDER = 'sequence_sender'

    ROOM = 'room'

    CLUB_ID = 'club_id'
    CLUB_UID = 'club_uid'

    MACHINES = 'machines'


class Errors:
    ERROR_404 = '404 (Объект не найден)'

    INTERNAL_SERVER_ERROR = '500 INTERNAL_SERVER_ERROR'
    NOT_IMPLEMENTED = '501 NOT IMPLEMENTED'

    SERVER_ADDRESS_ERROR = 'Server address format error. Need like "ip:port"'

    AUTHENTICATION_ERROR = 'Ошибка аутентификации'
    PERMISSION_DENIED = 'Отказано в доступе'
    CLIENT_BANNED = 'Пользователь забанен'
    PASSWORD_INVALID = 'Пароль неверный'

    AUTHENTICATION_FAIL = 'Oops. Something wrong. Maybe you should try another email/password'
    HASH_NOT_EXIST = 'Hash does not exist'
    EMAIL_NOT_EXIST = 'Email does not exist'
    EMAIL_ALREADY_EXIST = 'Email already exist'
    VERIFY_FAIL = 'Verify fail. User error'

    CLUB_NOT_EXIST = 'Клуб не найден'
    ZONE_NOT_EXIST = 'Зона не найдена'

    ZONE_LIMIT_REACHED = 'Достигнут лимит зон для клуба'

    MACHINE_NOT_EXIST = 'Машина не найдена'
    MACHINE_STATUS_NOT_AVAILABLE = 'Статус ПК не доступен'

    CASH_SESSION_NOT_EXIST = 'Кассовая смена не найдена'
    CASH_SESSION_NOT_OPENED = 'Кассовая смена не открыта'
    CASH_SESSION_ALREADY_OPENED = 'Кассовая смена уже открыта в клубе'

    CASH_SESSION_H24_PASSED = 'Кассовая смена открыта более 24 часов'
    CASH_SESSION_USER_ONLY_PERMIT_OPERATIONS = 'Операции по Кассовой смене может проводить только пользователь открывший её'

    CASH_OPERATION_NOT_EXIST = 'Кассовая Операция не найдена'
    CLIENT_SESSION_NOT_EXIST = 'Клиентская Сессия не найдена'

    CLIENT_SESSION_ALREADY_ACTIVE = 'Клиентская Сессия уже активна'

    CLIENT_NOT_EXIST = 'Клиент не найден'
    PASSWORD_ALREADY_RESETED = 'Пароль уже сброшен'

    STORE_PROVIDER_NOT_EXIST = 'Поставщик не найден'

    STORE_ITEM_NOT_EXIST = 'Товар не найден в БД'
    STORE_SERVICE_NOT_EXIST = 'Услуга не найдена в БД'
    SHOWCASE_ITEM_NOT_EXIST = 'Товар в Магазине не найден'
    STORAGE_ITEM_NOT_EXIST = 'Товар на Складе не найден'

    EMPLOYEE_NOT_EXIST = 'Сотрудник не найден'

    TASK_NOT_EXIST = 'Задача не найдена'
    RESERVE_GROUP_NOT_EXIST = 'Группа Бронирования не найдена'

    ROLES_LIMIT_REACHED = 'Достигнут лимит ролей для клуба'

    TARIFF_TIME_ERROR = 'Дата начала не может превышать или быть равной дате конца'
    TARIFF_COLLISION_ERROR = 'Ошибка коллизии'

    DISCOUNT_LEVEL_ERROR = 'Уровень уже существует'
    DISCOUNT_LEVEl_SUM_ERROR = 'Сумма От не может превышать или быть равной сумме До'
    DISCOUNT_LEVEL_COLLISION_ERROR = 'Обнаружена коллизия с уровнем '
    DISCOUNT_LEVEL_NOT_FOUND = 'Уровень скидок не найден'

    CLIENT_STORE_ORDER_NOT_EXIST = 'Заказ не найден'

    GAME_NOT_EXIST = 'Игра не найдена'

    PROHIBITED_PROCESS_NOT_EXIST = 'Запрещённый процесс не найден'

    SERVICE_NOT_EXIST = 'Запрещённый процесс не найден'


class RedisKeys:
    @staticmethod
    def club_machines_statuses(club_id: int) -> str:
        return f'CLUB_MACHINE_STATUSES__{club_id}'

    @staticmethod
    def club_tariffs_empty_times(club_id: int) -> str:
        return f'CLUB_TARIFFS_EMPTY_TIMES__{club_id}'

    @staticmethod
    def role_perms_by_id(role_id: int) -> str:
        return f'ROLE_BY_ID__{role_id}'

    @staticmethod
    def club_packets_to_sell(club_id: int) -> str:
        return f'CLUB_{club_id}__PACKETS_TO_SELL'

    @staticmethod
    def club_packets_to_active(club_id: int) -> str:
        return f'CLUB_{club_id}__PACKETS_TO_ACTIVE'

    @staticmethod
    def zone_packets_to_sell(club_id: int) -> str:
        return f'ZONE_{club_id}__PACKETS_TO_SELL'

    @staticmethod
    def zone_packets_to_active(club_id: int) -> str:
        return f'ZONE_{club_id}__PACKETS_TO_ACTIVE'
