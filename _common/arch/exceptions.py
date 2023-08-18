class NotExist404(Exception):
    def __init__(self, entity_name: str):
        self.error = f'{entity_name} not exist. (404)'

    def __str__(self):
        return self.error
