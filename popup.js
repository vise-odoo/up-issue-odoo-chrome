document.addEventListener("DOMContentLoaded", function () {
    var ignore_ids = [];

    function loadData() {
        chrome.runtime.sendMessage({ignore_ids: ignore_ids}, function (response) {
            if (response.erreur) {
                document.getElementById("erreur_div").classList.remove("hidden");
                document.getElementById("erreur_log").innerHTML = response.erreur;
            } else {
                document.getElementById("len_tasks").innerHTML = response.len_tasks;
                document.getElementById("id").innerHTML = response.id;
                document.getElementById("name").innerHTML = response.name;
                var url =
                    "https://www.odoo.com/web#id=" +
                    response.id +
                    "&menu_id=4720&cids=1&action=333&active_id=70&model=project.task&view_type=form";
                document.getElementById("url").href = url;
                document.getElementById("task_tags").innerHTML = response.tag_ids;
                document.getElementById("description").innerHTML = response.description;
                document.getElementById("data").classList.remove("hidden");
                document.getElementById("bouton-ignorer").classList.remove("hidden");
            }
        });
    }

    loadData();

    document.querySelector("#bouton-ignorer").addEventListener("click", function () {
        var current_task_id = parseInt(document.getElementById("id").innerHTML, 10);
        ignore_ids.push(current_task_id);
        loadData();
        document.getElementById("bouton-annuler-ignorer").classList.remove("hidden");
        document.getElementById("div_len_ignorées").classList.remove("hidden");
        document.getElementById("len_ignorées").innerHTML = ignore_ids.length;
    });

    document.querySelector("#bouton-annuler-ignorer").addEventListener("click", function () {
        ignore_ids = [];
        loadData();
        document.getElementById("bouton-annuler-ignorer").classList.add("hidden");
        document.getElementById("div_len_ignorées").classList.add("hidden");
    });
});
