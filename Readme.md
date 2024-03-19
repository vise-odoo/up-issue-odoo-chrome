# Donne-moi une Upgrade Issue !

## Vincent SEVESTRE

### Installation

Pour installer l'extension, veuillez suivre les étapes suivantes :

1- Placez le fichier com.viseodoo.donnemoiup.json dans le répertoire suivant :

Si vous utilisez Google Chrome en tant qu'utilisateur : `~/.config/google-chrome/NativeMessagingHosts` Si vous utilisez
Google Chrome en tant qu'administrateur : `~/etc/opt/chrome/native-messaging-hosts/`

2 - Ouvrez Google Chrome et accédez au Magasin des extensions.

Sélectionnez l'option "Charger l'extension non empaquetée" et choisissez le répertoire où vous avez extrait les fichiers
de l'extension.

3 - Dans le fichier `native.py`, remplacer les valeurs

```python
username = 'vise@odoo.com'
password = 'XXXX'
```

par les bonnes valeurs (le mot de passe est obtenu en suivant le protocole d'installation
[XML-RPC](https://www.odoo.com/documentation/17.0/developer/reference/external_api.html))
