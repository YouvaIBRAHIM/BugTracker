export function generateHeader(currentPage) {
    const body = $("body");

    body.prepend(`
        <header class="cyberpunk">
            <h1 class="cyberpunk glitched">Bug Tracker</h1>
            <nav>
                <a class="arrowMenu"><img src="../assets/arrow.svg"></a>
                <ul>
                    <li class="menuItem ${currentPage == "bugsList" ? "active" : ""}">
                        <a href="/src/pages/bugsList.html">Liste des bugs</a>
                    </li>
                    <li class="menuItem ${currentPage == "myBugs" ? "active" : ""}">
                        <a href="/src/pages/myBugs.html">À traiter</a>
                    </li>
                    <li class="menuItem ${currentPage == "newBug" ? "active" : ""}">
                    <a href="/src/pages/newBug.html">Nouveau bug</a>
                    </li>
                </ul>
            </nav>
        </header>
    `);
}