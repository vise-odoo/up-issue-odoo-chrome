# Donne-moi une Upgrade Issue !

## Vincent SEVESTRE

### Installation

Pour installer l'extension, veuillez suivre les étapes suivantes :

1- Placez le fichier `com.viseodoo.donnemoiup.json` dans le répertoire suivant :

Si vous utilisez Google Chrome en tant qu'utilisateur : `~/.config/google-chrome/NativeMessagingHosts` Si vous utilisez
Google Chrome en tant qu'administrateur : `~/etc/opt/chrome/native-messaging-hosts/`

Dans le fichier `com.viseodoo.donnemoiup.json`, s'assurer que le chemin `"path": XXX` est correct.

2 - Ouvrez Google Chrome et accédez au Magasin des extensions.

Sélectionnez l'option "Charger l'extension non empaquetée" et choisissez le répertoire où vous avez extrait les fichiers
de l'extension.

Lorsque l'extension est installée, copier la valeur de l'Identifiant de l'extension (unique à chaque fois) dans le champ `"allowed_origins"` du fichier `com.viseodoo.donnemoiup.json`.

<img src="https://github.com/vise-odoo/up-issue-odoo-chrome/assets/100482501/3d3d2fbc-faec-465c-a47c-10d6b91c9f09" width="50%" height="50%">

<img src="https://github.com/vise-odoo/up-issue-odoo-chrome/assets/100482501/f4833120-6a8e-4333-bdaf-db870a9bca61" width="75%" height="75%">

3 - Dans le fichier `credentials.ini`, remplacer les valeurs

```python
username = 'XXXX'
password = 'XXXX'
```

par les identifiants qui conviennent. (le mot de passe est obtenu en suivant le protocole d'installation
[XML-RPC](https://www.odoo.com/documentation/17.0/developer/reference/external_api.html), il correspond à la valeur d'une clé API)

