document.addEventListener("DOMContentLoaded", function () {
    let ignore_ids = JSON.parse(localStorage.getItem('ignore_ids')) || [];

    window.onload = function () {
        let selectedTags = JSON.parse(localStorage.getItem('selectedTags')) || [];
        let ignoreRollingRelease = JSON.parse(localStorage.getItem('ignoreRollingRelease')) || true;

        if (ignoreRollingRelease) {
            document.getElementById('rolling release').checked = true;
        }

        selectedTags.forEach(tag => {
            document.getElementById(tag).checked = true;
        });

        if (selectedTags.length > 0) {
            document.getElementById('filter-tags').checked = true;
            document.getElementById("tag-filters").classList.toggle("hidden");
        }

        loadData();
    }

    const getSelectedTags = () => {
        let checkboxes = document.querySelectorAll("#tag-filters input[name='tag']:checked");
        return Array.from(checkboxes, checkbox => checkbox.id);
    }

    const getIgnoreRollingRelease = () => {
        let checkbox = document.querySelectorAll("input[name='rolling-release-tag']:checked");
        return checkbox.length > 0;
    }

    const loadData = () => {
        let selectedTags = getSelectedTags();
        localStorage.setItem('selectedTags', JSON.stringify(selectedTags));

        let ignoreRollingRelease = getIgnoreRollingRelease();
        localStorage.setItem('ignoreRollingRelease', JSON.stringify(ignoreRollingRelease));

        chrome.runtime.sendMessage({ignore_ids: ignore_ids, selected_tags: selectedTags, ignoreRollingRelease: ignoreRollingRelease}, function (response) {
            if (response.erreur) {
                document.getElementById("erreur_div").classList.remove("hidden");
                document.getElementById("erreur_log").innerHTML = response.erreur;
            } else {
                document.getElementById("len_tasks").innerHTML = response.len_tasks;
                document.getElementById("id").innerHTML = response.id;
                document.getElementById("name").innerHTML = response.name;
                var url = "https://www.odoo.com/web#id=" + response.id + "&menu_id=4720&cids=1&action=333&active_id=70&model=project.task&view_type=form";
                document.getElementById("url").href = url;
                document.getElementById("task_tags").innerHTML = response.tag_ids;
                document.getElementById("description").innerHTML = response.description;
                document.getElementById("data").classList.remove("hidden");
                document.getElementById("bouton-ignorer").classList.remove("hidden");
                document.getElementById("chargement").classList.add("hidden");

                if (ignore_ids.length > 0) {
                    document.getElementById("bouton-annuler-ignorer").classList.remove("hidden");
                    document.getElementById("div_len_ignorées").classList.remove("hidden");
                    document.getElementById("len_ignorées").innerHTML = ignore_ids.length;
                }
            }
        });
    }

    document.querySelector("#filter-tags").addEventListener("change", function () {
        var filterTagsCheckbox = document.getElementById("filter-tags");
        if (!filterTagsCheckbox.checked) {
            var tagCheckboxes = document.querySelectorAll("#tag-filters input[type='checkbox']");
            tagCheckboxes.forEach(checkbox => checkbox.checked = false);
            loadData();
        }
        document.getElementById("tag-filters").classList.toggle("hidden");
    });

    var tagCheckboxes = document.querySelectorAll("#tag-filters input[name='tag']");
    tagCheckboxes.forEach(checkbox => checkbox.addEventListener("change", loadData));

    var tagCheckboxes = document.querySelectorAll("input[name='rolling-release-tag']");
    tagCheckboxes.forEach(checkbox => checkbox.addEventListener("change", loadData));

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
