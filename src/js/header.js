export function generateHeader(currentPage) {
    const body = $("body");

    body.prepend(`
        <header class="cyberpunk">
            <aside class="cyberpunk logoutAside">
                <ul class="logout">
                    <li>
                        <a href=""><i class="fa fa-power-off" style="font-size:18px;color:#FF013C"></i> DÉCONNEXION</a>
                    </li>
                </ul>
            </aside>
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