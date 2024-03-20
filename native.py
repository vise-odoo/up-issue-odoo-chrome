#!/usr/bin/env python3

import configparser
import sys
import json
import struct
import xmlrpc.client

url = "https://www.odoo.com"
db = "openerp"
upgrade_issue_id = 70
# In terminal, these vars are set with `export ODOO_XML_USERNAME = "xxx"`

config = configparser.ConfigParser()
config.read('credentials.ini')

username = config.get('credentials', 'username')
password = config.get('credentials', 'password')

print(username)
print(password)
def get_message():
    raw_length = sys.stdin.buffer.read(4)
    if not raw_length:
        return None
    message_length = struct.unpack("=I", raw_length)[0]
    message = sys.stdin.buffer.read(message_length).decode("utf-8")
    return json.loads(message)

def send_message(message):
    encoded_content = json.dumps(message).encode("utf-8")
    encoded_length = struct.pack("=I", len(encoded_content))
    sys.stdout.buffer.write(encoded_length)
    sys.stdout.buffer.write(encoded_content)
    sys.stdout.buffer.flush()

def get_tasks(models, uid):
    domain =  [
            ["project_id", "=", upgrade_issue_id],
            ["state", "in", ["01_in_progress", "02_changes_requested", "03_approved", "04_waiting_normal"]],
            ["stage_id.name", "=", "Ready for Technical"],
            ["user_ids", "=", False],
            ["tag_ids", "not ilike", "Maintained by"],
            ["tag_ids", "not ilike", "Maintenance of"],
        ]

    if selected_tags:
        tag_conditions = ["|"] * (len(selected_tags) - 1)
        for tag in selected_tags:
            tag_conditions += [["tag_ids.name", "ilike", tag]]
        domain += tag_conditions 

    if ignoreRollingRelease:
        domain += [["tag_ids", 'not ilike', "rolling release"]]

    tasks = models.execute_kw(
        db,
        uid,
        password,
        "project.task",
        "search_read",
        [
            domain,
        ],
        {"fields": ["id", "name", "tag_ids", "description"], "order": "id"},
    )

    tags = models.execute_kw(
        db,
        uid,
        password,
        "project.tags",
        "search_read",
        [["|", ["name", "ilike", "UP-"], ["name", "ilike", "rolling"]]],
        {"fields": ["id", "name"]},
    )

    tag_dict = {tag["id"]: tag["name"] for tag in tags}
    for task in tasks:
        task["tag_ids"] = [tag_dict[tag_id] if tag_id in tag_dict else "" for tag_id in task["tag_ids"]]
        task["description"] = task["description"].replace("<br>", "<br/>\n").replace("</p>", "</p>\n\n")
    return tasks

def get_oldest_task(tasks, ignored_ids):
    i = 0
    while tasks[i]["id"] in ignored_ids:
        i += 1
    tasks[i]["len_tasks"] = len(tasks)
    return tasks[i]

received_message = get_message()
ignored_ids = received_message.get("ignore_ids", [])
selected_tags = received_message.get("selected_tags", [])
ignoreRollingRelease = received_message.get("ignoreRollingRelease", [])

try:
    common = xmlrpc.client.ServerProxy(f"{url}/xmlrpc/2/common")
    uid = common.authenticate(db, username, password, {})
    models = xmlrpc.client.ServerProxy(f"{url}/xmlrpc/2/object")
    tasks = get_tasks(models, uid)
    task = get_oldest_task(tasks, ignored_ids)
    send_message(task)
except (xmlrpc.client.Fault, xmlrpc.client.ProtocolError) as err:
    send_message({"error": "XML-RPC error: " + str(err)})
except Exception as err:
    send_message({"error": "An error occurred: " + str(err)})