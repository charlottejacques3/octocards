// size + buttons correctly 
tbl = document.getElementsByTagName("table")[0]
tbl_height = tbl.offsetHeight
tbl_width = tbl.offsetWidth
document.getElementById("new-col").style.height = tbl_height + "px"
document.getElementById("new-row").style.width = tbl_width + "px"