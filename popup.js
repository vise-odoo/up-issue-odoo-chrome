document.addEventListener("DOMContentLoaded", function () {
    var ignore_ids = JSON.parse(localStorage.getItem('ignore_ids')) || [];

    window.onload = function () {
        var selectedTags = JSON.parse(localStorage.getItem('selectedTags')) || [];
        for (var i = 0; i < selectedTags.length; i++) {
            document.getElementById(selectedTags[i]).checked = true;
        }
        if (selectedTags.length > 0){
            document.getElementById('filter-tags').checked = true;
            document.getElementById("tag-filters").classList.toggle("hidden");
        }
        loadData();
    };

    function getSelectedTags() {
        var checkboxes = document.querySelectorAll("#tag-filters input[name='tag']:checked");
        var selectedTags = [];
        for (var i = 0; i < checkboxes.length; i++) {
            selectedTags.push(checkboxes[i].id);
        }
        return selectedTags;
    }

    function loadData() {
        var selectedTags = getSelectedTags();
        localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
        chrome.runtime.sendMessage({ignore_ids: ignore_ids, selected_tags: selectedTags}, function (response) {
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
                document.getElementById("chargement").classList.add("hidden");
                if (ignore_ids.length > 0){
                    document.getElementById("bouton-annuler-ignorer").classList.remove("hidden");
                    document.getElementById("div_len_ignorées").classList.remove("hidden");
                    document.getElementById("len_ignorées").innerHTML = ignore_ids.length;
                } 
            }
        });
    }
    document.querySelector("#filter-tags").addEventListener("change", function () {
        document.getElementById("tag-filters").classList.toggle("hidden");
    });

    var tagCheckboxes = document.querySelectorAll("#tag-filters input[name='tag']");
    for (var i = 0; i < tagCheckboxes.length; i++) {
        tagCheckboxes[i].addEventListener("change", loadData);
    }

    document.querySelector("#bouton-ignorer").addEventListener("click", function () {
        var current_task_id = parseInt(document.getElementById("id").innerHTML, 10);
        ignore_ids.push(current_task_id);
        localStorage.setItem('ignore_ids', JSON.stringify(ignore_ids));
        loadData();
        document.getElementById("bouton-annuler-ignorer").classList.remove("hidden");
        document.getElementById("div_len_ignorées").classList.remove("hidden");
        document.getElementById("len_ignorées").innerHTML = ignore_ids.length;
    });

    document.querySelector("#bouton-annuler-ignorer").addEventListener("click", function () {
        ignore_ids = [];
        localStorage.removeItem('ignore_ids');
        loadData();
        document.getElementById("bouton-annuler-ignorer").classList.add("hidden");
        document.getElementById("div_len_ignorées").classList.add("hidden");
    });
});
