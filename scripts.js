document.getElementById("strongerpunchButton").addEventListener("click", function() {
    document.getElementById("textarea").innerHTML = "Your punches are stronger. Your blows deal one more damage dice (1d4 instead of 1d2 by default).";
  });

  document.getElementById("strongerbodyButton").addEventListener("click", function() {
    document.getElementById("textarea").innerHTML = "You are stronger against attacks. Your defensive prowess increases by 2.";
    generateTableData();
  });


  function generateTableData() {
    const table = document.getElementById('myTable');
    while (table.firstChild) {
      table.removeChild(table.firstChild);
    }
  
    const headerTr = document.createElement('tr');
    const levelHdrTd = document.createElement('th');
    const bonusHdrTd = document.createElement('th');
  
    levelHdrTd.textContent = 'Level';
    bonusHdrTd.textContent = 'Defensive Prowess Bonus';
  
    headerTr.appendChild(levelHdrTd);
    headerTr.appendChild(bonusHdrTd);
    table.appendChild(headerTr);
  
    const levelData = [1, 5, 10, 15, 20];
    const bonusData = [2, 4, 6, 8, 10];
  
    for (let i = 0; i < levelData.length; i++) {
      const tr = document.createElement('tr');
      const levelTd = document.createElement('td');
      const bonusTd = document.createElement('td');
  
      levelTd.textContent = levelData[i];
      bonusTd.textContent = bonusData[i];
  
      tr.appendChild(levelTd);
      tr.appendChild(bonusTd);
      table.appendChild(tr);
    }
  }