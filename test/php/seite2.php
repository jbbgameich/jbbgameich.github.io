<?php
$password = $_POST["password"];
$username = $_POST["username"];
?>

<html>
<p>
</html>

<?php
echo $vorname;
?> 

<html>
<p>
</html>


<?php
if($password == "#01" AND $username == "JBB") 
   {
   echo "<strong>Hallo Admin, du wurdest Angemeldet</strong><p>!Achtung! Dies sind Geheime Daten! Kopieren sie sie nicht auf andere Rechnner. Sie wurden jetzt berechtigt auf das Internet zuzuggreifen. Herzlichen Glückwunsch</p>";
   }
else 
   {
   echo "was fällt dir ein in meinen Passwortgeschützen Bereich einbrechen zu wollen!!!!!!!!?";
   }
?>
