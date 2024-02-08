<?php

// Database configuration
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'truetalent';

// Connect to MySQL database
$mysqli = new mysqli($host, $user, $password, $database);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get JSON input from Python script
$jsonInput = file_get_contents('php://input');
$data = json_decode($jsonInput, true);

// Extract relevant data
$email = $data['email'];
$rowNewFile = $data['row_newfile'];
$rowOldFile = $data['row_oldfile'];
$rowDuplicate = $data['row_dublicate'];

// Check if email exists in the database
$query = "SELECT Email FROM email WHERE Email = ?";
$stmt = $mysqli->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
$rowCount = $stmt->num_rows;
$stmt->close();

// Perform actions based on database query result
if ($rowCount > 0) {
    // Email exists in the database
    echo json_encode([
        "email" => $email,
        "row_newfile" => $rowNewFile,
        "row_oldfile" => $rowOldFile + 1,  // Increment old file count
        "row_dublicate" => $rowDuplicate
    ]);
} else {
    // Email does not exist in the database, perform insert
    $insertQuery = "INSERT INTO email (Email) VALUES (?)";
    $insertStmt = $mysqli->prepare($insertQuery);
    $insertStmt->bind_param("s", $email);
    $insertStmt->execute();
    $insertStmt->close();

    echo json_encode([
        "email" => $email,
        "row_newfile" => $rowNewFile + 1,  // Increment new file count
        "row_oldfile" => $rowOldFile,
        "row_dublicate" => $rowDuplicate
    ]);
}

// Close database connection
$mysqli->close();

?>
