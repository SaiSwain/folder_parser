<!DOCTYPE html>
<html>
<head>
    <title>CSV File Upload</title>
</head>
<body>
    
<h2>CSV File Upload</h2>

<form action="index.php" method="post" enctype="multipart/form-data">
    Select CSV file(s) to upload:
    <input type="file" name="fileToUpload[]" id="fileToUpload" accept=".csv" multiple>
    <input type="submit" value="Upload" name="submit">
</form>

<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "webscraping";
$tableName = "companydetails";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$successMessage = ""; // Initialize success message

if (isset($_POST["submit"])) {
    foreach ($_FILES["fileToUpload"]["name"] as $key => $value) {
        // File details
        $targetDir = "uploads/";
        $targetFile = $targetDir . basename($_FILES["fileToUpload"]["name"][$key]);

        

        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"][$key], $targetFile)) {
            echo "The file ". basename( $_FILES["fileToUpload"]["name"][$key]). " has been uploaded.";
            
            // Read the CSV file
            if (($handle = fopen($targetFile, "r")) !== false) {
                while (($data = fgetcsv($handle, 0, ",")) !== false) {
                    // Escape values to prevent SQL injection
                    $escapedValues = array_map(array($conn, 'real_escape_string'), $data);
                    $columns = implode("','", $escapedValues);
                    
                    $sql = "INSERT INTO $tableName (companyname, scrapingdateandtime, jobid, jobtitle, jobtitleurl, joblocation, jobtype, skills, salary, numberofopenings, companyurl, companylogo, postedtime, yearofexperience, qualifications, jobdescription, preferredqualification, summery, additionalrequirements, secondaryskills) VALUES ('$columns')";
                    
                    if ($conn->query($sql) === TRUE) {
                        $successMessage = "Records inserted successfully";
                    } else {
                        echo "Error inserting record: " . $conn->error;
                    }
                }
                fclose($handle);
            } else {
                echo "Error opening file";
            }
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }
}

// Display success message once after processing all files
echo $successMessage;

// Close connection
$conn->close();

?>

</body>
</html>
