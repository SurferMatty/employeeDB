//Table information functions
const getEmployeeData = () => {
    $.ajax({
        url: "resources/php/getAll.php",
        type: "GET",
        dataType: "json",
        data: {

        },
        success: function(res){
            $('.employeeRow').remove();
            res['data'].forEach(function (entry, index){
                $('#employeeData').append('<tr data-type="employee" class="employeeRow" data-id="' + entry['id'] + '"><td class="tableFirstName">' + entry['firstName'] + '</td><td class="tableLastName">' + entry['lastName'] + '</td><td class="tablePosition">'+ entry['jobTitle'] +'</td><td class="tableDepartment" value="' + entry['departmentID'] + '">'+ entry['department'] + '</td><td class="tableLocation d-none d-md-table-cell">' + entry['location'] + '</td><td class="tableEmail">' + entry['email'] + '<td><button class="btn btn-secondary" onclick="editEntry(this)">Edit</button></td><td><button class="btn btn-secondary" onclick="confirmDelete(this)">Delete</button></td></tr>');
            });

        }, error: function(jqXHR, textStatus, error){
            console.log(jqXHR);
            console.log(textStatus);
            console.log(error);
        },
    });
};

const getLocationData = () => {
    $.ajax({
        url: "resources/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        data: {

        },
        success: function(res){
            $('.locationRow').remove();
            res['data'].forEach(function (entry, index){
                $('#locationData').append('<tr class="locationRow" data-type="location" data-id="' + entry['locationID'] + '"><td class="tableLocation">' + entry['locationName'] + '</td><td><button class="btn btn-secondary" onClick="editEntry(this)">Edit</button></td><td><button class="btn btn-secondary" onclick="confirmDelete(this)">Delete</button></td></tr>');
            });

        }, error: function(jqXHR, textStatus, error){
            console.log(jqXHR);
            console.log(textStatus);
            console.log(error);
        },
    });
};

const getDepartmentData = () =>{
    $.ajax({
        url: "resources/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        data: {
                
        },
        success: function(res){
            $('.departmentRow').remove();
            res['data'].forEach(function (entry, index){
            $('#departmentData').append('<tr class="departmentRow" data-type="department" data-id="' + entry['departmentID'] +' "><td class="tableDepartment">' + entry['departmentName'] + '</td><td class="tableLocation" value="' + entry['locationID'] + '">' + entry['locationName'] + '</td><td><button class="btn btn-secondary" onclick="editEntry(this)">Edit</button></td><td><button class="btn btn-secondary" onclick="confirmDelete(this)">Delete</button></td></tr>');
            });
        }, error: function(jqXHR, textStatus, error){
            console.log(jqXHR);
            console.log(textStatus);
            console.log(error);
        },
    });
};

//Dropdown select option data functions
const selectLocations = (select) => {
    $.ajax({
        url: "resources/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        data: {
                
        },
        success: function(res){
            $selectClass = select.attr('id') + 'removeDep';
            $($selectClass).remove();
            res['data'].forEach(function (entry, index){
                $(select).append('<option class="' + $selectClass + '" value="' + entry['locationID'] + '">' + entry['locationName'] + '</option>');
            });
        }, error: function(jqXHR, textStatus, error){
            console.log(jqXHR);
            console.log(textStatus);
            console.log(error);
        },
    });
};

const selectDepartments = (select) => {
    $.ajax({
        url: "resources/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        data: {
                
        },
        success: function(res){
            $selectClass = select.attr('id') + 'removeDep';
            $($selectClass).remove();
            res['data'].forEach(function (entry, index){
                $(select).append('<option value="' + entry['departmentID'] + '"class="' + $selectClass + '">' + entry['departmentName'] + '</option>');
            });
        }, error: function(jqXHR, textStatus, error){
            console.log(jqXHR);
            console.log(textStatus);
            console.log(error);
        },
    });
};


//Add entry function
const addEntry = ($type, formData) => {

    switch ($type){
        case "employee":
                $.ajax({
                    url: "resources/php/insertEmployee.php",
                    type: "POST",
                    dataType: "json",
                    data:{
                        firstName: formData.get('firstName'),
                        lastName: formData.get('lastName'),
                        email: formData.get('email'),
                        jobTitle: formData.get('jobTitle'),
                        departmentID: formData.get('department'),
                    },
                    success: function(res){
                        if(checkSuccess(res)){
                        getEmployeeData();
                        addSuccess($type, formData.get('firstName'));
                        $("#employeeForm")[0].reset();
                        };
                    }, error: function(jqXHR, textStatus, error){
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(error);
                    },
                });
            break;

        case "department":
            $.ajax({
                url: "resources/php/insertDepartment.php",
                type: "POST",
                dataType: "json",
                data:{
                    name: formData.get('department'),
                    locationID: formData.get('location'),
                },
                success: function(res){
                    if(checkSuccess(res)){
                    getDepartmentData();
                    selectDepartments($("#departmentSelect"));
                    addSuccess($type, formData.get('department'));
                    $("#departmentForm")[0].reset();
                    };
                }, error: function(jqXHR, textStatus, error){
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(error);
                },
            });
            break;

        case "location":
            $.ajax({
                url: "resources/php/insertLocation.php",
                type: "POST",
                dataType: "json",
                data:{
                    name: formData.get('location'),
                },
                success: function(res){
                    if(checkSuccess(res)){
                    selectLocations($("#locationSelect"));
                    getLocationData();
                    addSuccess($type, formData.get('location'));
                    $("#locationForm")[0].reset();
                    };
                }, error: function(jqXHR, textStatus, error){
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(error);
                },
            });
            break;
    }
};

//Edit entry function
const editEntry = (btn) => {

    if(editing){
        editingMessage();
        return;
    }
    editing = true;

    $row = $(btn).closest("tr");
    $type = $row.attr("data-type");

    switch ($type){
        case "employee":
            
                $firstName = $row.find("td.tableFirstName").text();
                $row.find("td.tableFirstName").html("<input class='form-control'  id='inputFirstName' value='" + $firstName + "'>");
            
                $lastName = $row.find("td.tableLastName").text();
                $row.find("td.tableLastName").html("<input class='form-control'  id='inputLastName' value='" + $lastName + "'>");
            
                $email = $row.find("td.tableEmail").text();
                $row.find("td.tableEmail").html("<input class='form-control' id='inputEmail' value='" + $email + "'>");
            
                $position = $row.find("td.tablePosition").text();
                $($row.find("td.tablePosition")).html("<input class='form-control' id='inputPosition' value ='" + $position + "'>");
            
                $department = $row.find("td.tableDepartment").text();
                $departmentID = $row.find("td.tableDepartment").attr("value");
                $($row.find("td.tableDepartment")).html('<select id="tableDepartmentSelect" class="custom-select form-control"></select>');
                selectDepartments($('#tableDepartmentSelect'));



                $(btn).text("Save").attr("onclick", "saveEntry(this)");
            
                
                setTimeout(function (){
                    $("#tableDepartmentSelect").val($departmentID);

                  }, 50);
            break;

        case "department":

            $department = $row.find("td.tableDepartment").text();
            $row.find("td.tableDepartment").html("<input class='form-control'  id='inputDepartment' value='" + $department + "'>");

            $locationID = $row.find("td.tableLocation").attr("value");
            $($row.find("td.tableLocation").html('<select id="tableLocationSelect" class="custom-select form-control"></select>'));
            selectLocations($('#tableLocationSelect'));

            $(btn).text("Save").attr("onclick", "saveEntry(this)");

            setTimeout(function (){
                $("#tableLocationSelect").val($locationID);

            }, 50);
            break;

        case "location":
            $location = $row.find("td.tableLocation").text();
        
            $($row.find("td.tableLocation").html("<input class='form-control' id='inputLocation' value='" + $location + "'>"));
            
            $(btn).text("Save").attr("onclick", "saveEntry(this)");
        
            break;
    }
};

//Save entry function
const saveEntry = (btn) => {

    if (confirm('Do you wish to save these changes?')) {

    $row = $(btn).closest("tr");
    $type = $row.attr("data-type");
    $id = $row.attr("data-id");

    switch ($type){
        case "employee":
            $firstName = $("#inputFirstName").val();
            $lastName = $("#inputLastName").val();
            $email = $("#inputEmail").val();
            $departmentID = $("#tableDepartmentSelect :selected").attr("value");
            $position = $("#inputPosition").val();

                    $.ajax({
                        url: "resources/php/editEmployee.php",
                        type: "POST",
                        dataType: "json",
                        data: {
                            firstName: $firstName,
                            lastName: $lastName,
                            email: $email,
                            departmentID: $departmentID,
                            position: $position,
                            id: $id,
                        },
                        success: function(res){
                            if(checkSuccess(res)){
                                saveSuccess($type, $firstName);
                                getEmployeeData();
                            };
                        }, error: function(jqXHR, textStatus, error){
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(error);
                        },
                    });
            break;

        case "department":
            $departmentName = $("#inputDepartment").val();
            $locationID = $("#tableLocationSelect :selected").attr("value");
            $locationName = $("#tableLocationSelect :selected").text();
            $.ajax({
                url:"resources/php/editDepartment.php",
                type: "POST",
                dataType: "json",
                data: {
                    departmentName: $departmentName,
                    departmentID: $id,
                    locationID: $locationID,
                },success: function(res){
                    console.log(res);
                    if(checkSuccess(res)){
                    saveSuccess($type, $departmentName);
                    getDepartmentData();
                    selectDepartments($('#departmentSelect'));
                    };
                }, error: function(jqXHR, textStatus, error){
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(error);
                },
            });
            break;

        case "location":
            $locationName = $('#inputLocation').val();
            console.log($id);
            console.log($locationName);
            $.ajax({
                url:"resources/php/editLocation.php",
                type: "POST",
                dataType: "json",
                data: {
                    id: $id,
                    locationName: $locationName,
                },success: function(res){
                    console.log(res);
                    if(checkSuccess(res)){
                    saveSuccess($type, $locationName);
                    getLocationData();
                    selectLocations($('locationSelect'));
                    };
                }, error: function(jqXHR, textStatus, error){
                    console.log(jqXHR);
                    console.log(textStatus);
                    console.log(error);
                },
            });
            break;
    };
}
};

//Delete entry function
const deleteEntry = (type, id) => {

            switch(type){
                case "employee":
                    $.ajax({
                        url:"resources/php/deleteEmployeeByID.php",
                        type: "POST",
                        dataType: "json",
                        data: {
                            id: id,
                        },success: function(res){
                            if(checkDeleteSuccess(res)){
                                getEmployeeData();
                                deleteSuccess('employee');
                            }
                        }, error: function(jqXHR, textStatus, error){
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(error);
                        },
                    });
                    break;
                case "location":
                    $.ajax({
                        url:"resources/php/deleteLocationByID.php",
                        type: "POST",
                        dataType: "json",
                        data: {
                            id: id,
                        },success: function(res){
                            if(checkDeleteSuccess(res)){
                                getLocationData();
                                selectLocations($("#locationSelect"));
                                deleteSuccess('location');
                            }
                        }, error: function(jqXHR, textStatus, error){
                            console.log(jqXHR);
                            console.log(textStatus);
                            console.log(error);
                        },
                    });
                    break;
                case"department":
                $.ajax({
                    url:"resources/php/deleteDepartmentByID.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: id,
                    },success: function(res){
                        if(checkDeleteSuccess(res)){
                            getDepartmentData();
                            selectDepartments($('#departmentSelect'));
                            deleteSuccess('department');
                        }
                    }, error: function(jqXHR, textStatus, error){
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(error);
                    },
                });
                    break;
            };
};

//Meta functions
const addSuccess = (type, name) => {
    $('#' + type + 'FormModal').modal('toggle');
    $capitalType = type.charAt(0).toUpperCase() + type.slice(1);
    $('#alertBoxHeader').html($capitalType + " Added.");
    $('#alertBoxContent').html(name + " has been successfully added to the " + $capitalType + " database.");
    $('#alertBox').modal("toggle");

}
const saveSuccess = (type, name) => {
    $('#' + type + 'FormModal').modal('toggle');
    $capitalType = type.charAt(0).toUpperCase() + type.slice(1);
    $('#alertBoxHeader').html(capitalType + "  Edited.");
    $('#alertBoxContent').html(name + " has been changed and saved.");
    $('#alertBox').modal("toggle");
    editing = false;
};

const deleteSuccess = (type) => {
    capitalType = type.charAt(0).toUpperCase() + type.slice(1);
    $('#alertBoxHeader').html(capitalType + "  Deleted.");
    $('#alertBoxContent').html("Entry Deleted.")
    setTimeout(function(){ 
        $('#alertBox').modal("toggle");
        $('#confirmButton').html('Confirm');
        $('#deleteButton').hide();
        $('#alertBox').modal('toggle');
     }, 500);
};

const editingMessage = () => {
    $('#alertBoxHeader').html("Edit Pending.");
    $('#alertBoxContent').html("Please finish editing the other entry first.");
};

const checkSuccess = (res) => {
    if(res['status']['description'] === "success"){
        return true;
    }else{
        $('#alertBoxHeader').html("Error in Query");
        $('#alertBoxContent').html("Failed query, error: " + res['status']['code'] + ". Please contact an administrator.");
        $('#alertBox').modal("toggle");
        return false;
    };
};

const checkDeleteSuccess = (res) => {
    if(res['rowsDeleted'] === 0){
        $('#alertBoxHeader').html("Dependant Entry.");
        $('#alertBoxContent').html("The entry has other entries that rely upon it, please edit or delete other entries before attempting to delete this.");
        $('#alertBox').modal("toggle");
        return false;
    }else{
        return true;
    }
}

const confirmDelete = (btn) => {

    $row = $(btn).closest("tr");
    $type = $row.attr("data-type");
    $id = $row.attr('data-id');

    $('#alertBoxHeader').html("Delete Confirmation");
    $('#alertBoxContent').html("Do you wish to delete this entry?");
    $('#confirmButton').html('Cancel');
    $('#deleteButton').attr('onClick', 'deleteEntry("' + $type + '" , ' + $id + ')');
    $('#deleteButton').show();
    $('#alertBox').modal('toggle');
}

let editing = false;

$(document).ready(function() {
    getEmployeeData();
    getDepartmentData();
    getLocationData();
    selectDepartments($("#departmentSelect"));
    selectLocations($("#locationSelect"));

    const employeeForm = $('#employeeForm')[0];
    employeeForm.addEventListener('submit', function(e){
        e.preventDefault();
        var formData = new FormData(employeeForm);
        addEntry('employee', formData);
    });

    const locationForm = $('#locationForm')[0];
    locationForm.addEventListener('submit', function(e){
        e.preventDefault();
        var formData = new FormData(locationForm);
        addEntry('location', formData);
    });

    const departmentForm = $('#departmentForm')[0];
    departmentForm.addEventListener('submit', function(e){
        e.preventDefault();
        var formData = new FormData(departmentForm);
        addEntry('department', formData);
    });

    $('#deleteButton').hide();


    //Changes table and form on request.
    $('.tableGroup').hide();
    $('.employeeTable').show();
    $('#tableType').change(function () {
        $('.tableGroup').hide();
        $('.' + $(this).val() + 'Table').show();
        $('#formType').attr('data-target', '#' + $(this).val() + 'FormModal')
    });



});