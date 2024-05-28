from django.apps import AppConfig

class BaseConfig(AppConfig):
    """
    Configuration de l'application de base.

    Cette classe hérite de la classe AppConfig de Django et fournit une configuration 
    pour l'application 'base'.
    """
    name = 'base'

    def ready(self):
        """
        Fonction appelée lorsque l'application est prête.

        Cette méthode est appelée lorsque l'application Django est prête à être utilisée.
        Nous l'utilisons ici pour importer les signaux de l'application de base afin qu'ils soient
        enregistrés lorsque Django démarre.
        """
        import base.signals  # Import des signaux de l'application de base
