$(window).on('load', function () {
    if ($('#preloader').length) {
    $('#preloader').delay(1000).fadeOut('slow', function() {
    $(this).remove();
    });
    }
  });

const menuClick = document.querySelector("#menuButton");
const navDropdown = document.querySelector("#dropdownContainer");

menuClick.addEventListener("click", function() {
    menuClick.classList.toggle("active");
    navDropdown.classList.toggle("visible");
});


// Declare variables
var currentId;
var employeeName;
var departmentId;
var departmentName;
var locationId;
var entries;
var table = document.getElementById("personnelData");
var rows = table.getElementsByTagName("tr");
var filters = {
  filterName: "",
  filterDept: "",
  filterLoc: ""
};

// Event listener for Name filter
$('#filterName').on('keyup', function() {
  filters.filterName = $(this).val().toUpperCase();
  filterRows();
});

// Event listener for Department filter
$('#filterDept').on('change', function() {
  filters.filterDept = $(this).find('option:selected').text();
  filterRows();
});

// Event listener for Location filter
$('#filterLoc').on('change', function() {
  filters.filterLoc = $(this).find('option:selected').text();
  filterRows();
});

function filterRows() {
  for (var i = 0; i < rows.length; i++) {
    var nameMatch = true;
    var deptMatch = true;
    var locMatch = true;

    // Check Name filter
    var name = rows[i].getElementsByTagName("td")[0];
    if (filters.filterName !== "" && name) {
      var nameValue = name.textContent || name.innerText;
      if (nameValue.toUpperCase().indexOf(filters.filterName) === -1) {
        nameMatch = false;
      }
    }

    // Check Department filter
    var dept = rows[i].getElementsByTagName("td")[3];
    if (filters.filterDept !== "" && dept) {
      var deptValue = dept.textContent || dept.innerText;
      if (deptValue !== filters.filterDept) {
        deptMatch = false;
      }
    }

    // Check Location filter
    var loc = rows[i].getElementsByTagName("td")[4];
    if (filters.filterLoc !== "" && loc) {
      var locValue = loc.textContent || loc.innerText;
      if (locValue !== filters.filterLoc) {
        locMatch = false;
      }
    }

    // Hide/show row based on filter matches
    if (nameMatch && deptMatch && locMatch) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
}




$('#editEmployeeButton').on('click', function() {
    $('#editEmployee').modal('show');
})
$('#addEmployeeButton').on('click', function() {
    $('#addEmployeeModal').modal('show');
})
$('#deleteEmployeePromt').on('click', function() {
    $('#deleteDialog').html(`Are you sure you want to delete ${employeeName}?`);
    $('#deleteEmployeeModal').modal('show');
})
$('#addNewDepartment').on('click', function() {
   
    $('#newDepartmentModal').modal('show');
})
$('#addNewLocation').on('click', function() {
    $('#newLocationModal').modal('show');
})
$('#resetButton').on('click', function() {
    location.reload(true);
})
$('#resetButton1').on('click', function() {
    location.reload(true);
})
$('#resetButton2').on('click', function() {
    location.reload(true);
})
function departments() {

    $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result.status.name == "ok") {
                result.data.forEach(dept => {
                    const optionEl = $('<option>', {
                        value: dept.id,
                        text: dept.name
                    });
                    $('#department').append(optionEl);
                });
                result.data.forEach(dept => {
                    const optionEl = $('<option>', {
                        value: dept.id,
                        text: dept.name
                    });
                    $('#filterDept').append(optionEl);
                });
            };
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    
};
function locations() {

    $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        success: function(result) {
          if (result.status.name == "ok") {
            const newDepartmentLocationSelect = $('#newDepartmentLocation');
            const filterLocSelect = $('#filterLoc');
            const departmentLocationSelect = $('#departmentLocation');
            
            result.data.forEach(location => {
                // console.log(location.id);
                // console.log(location.name); 
              const optionEl = $('<option>').val(location.id).text(location.name);
              newDepartmentLocationSelect.append(optionEl.clone());
              filterLocSelect.append(optionEl.clone());
              departmentLocationSelect.append(optionEl.clone());
            });
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
        }
      });
      
};
$(document).ready(function() { 
    updateTable();
    departments();
    locations();
});

function updateTable() {

    $('#personnelData').empty();
    $('#departmentData').empty();
    $('#locationData').empty();
    $('#filterDept').empty();
    $('#department').empty();
    $('#newDepartmentLocation').empty();
    $('#filterLoc').empty();
    $('#departmentLocation').empty();
    departments();
    locations();
    $.ajax({
        url: "libs/php/getAll.php",
        type: "GET",
        dataType: "json",
    
        success: function(result) {
            if (result.status.name === "ok") {
                const employeeData = result.data;
    
                employeeData.forEach((employee, i) => {
                    fullName = `${employee.firstName} ${employee.lastName}`;
                    const employeeNameId = `${i}-employeeName`;
                    const employeeEmailId = `${i}-employeeEmail`;
                    const employeeDeptId = `${i}-employeeDepartment`;
                    const employeeLocId = `${i}-employeeLocation`;
                    const employeeJobTitleId = `${i}-employeeJobTitle`;
                    const employeeId = `${i}-id`;
    
                    const employeeRow = `<tr>
                                            <td id="${employeeNameId}">${fullName}</td>
                                            <td class="style2" id="${employeeEmailId}">${employee.email}</td>
                                            <td class="style2" id="${employeeJobTitleId}">${employee.jobTitle}</td>
                                            <td class="style3" id="${employeeDeptId}" class="depFilter">${employee.department}</td>
                                            <td class="style4" id="${employeeLocId}">${employee.location}</td>
                                            <td>
                                                <button type="button" class="btn btn-primary" id="${i}-employee" data-toggle="modal" onclick="fillEditForm(${i}); $('#employeeInformation').modal('show');">
                                                    <i class="fa-solid fa-eye" id="viewModal"></i>
                                                </button>
                                            </td>
                                            <td style="display: none; width: 0;" id="${employeeId}">${employee.id}</td>
                                        </tr>`;
    
                    $('#personnelData').append(employeeRow);
                });
            }
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    $.ajax({
        url: "libs/php/getDepartments.php",
        type: "GET",
        dataType: "json",
        success: function(result) {
            if (result.status.name === "ok") {
                const departmentData = result.data;
        
                departmentData.forEach((department, i) => {
                    const departmentNameId = `${i}-departmentName`;
                    const departmentLocId = `${i}-departmentLocation`;
                    const departmentId = `${i}-departmentId`;
        
                    const departmentRow = `<tr>
                                                <td id="${departmentNameId}">${department.department_name}</td>
                                                <td class="style3" id="${departmentLocId}">${department.location_name}</td>
                                                <td>
                                                    <button type="button" class="btn btn-primary" id="${i}-department" data-toggle="modal" onclick="fillEditFormDep(${i}); $('#editDepartmentModal').modal('show');">
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-primary" id="${i}-department" data-toggle="modal" onclick="fillEditFormDep(${i}); $('#deleteDepartmentModal').modal('show');">
                                                        <i class="fa-solid fa-trash" id="viewModal"></i>
                                                    </button>
                                                </td>
                                                <td  style="display: none; width: 0;" id="${departmentId}">${department.department_id}</td>
                                            </tr>`;
        
                    $('#departmentData').append(departmentRow);
                });
            }
        },
        
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    $.ajax({
        url: "libs/php/getLocations.php",
        type: "GET",
        dataType: "json",
        success: function(result) {
          if (result.status.name === "ok") {
            const locationData = result.data;
      
            locationData.forEach((location, i) => {
              const locationNameId = `${i}-locationName`;
              const locationIdId = `${i}-locationId`;
      
              const locationRow = `<tr>
                <td id="${locationNameId}">${location.name}</td>
                <td>
                                                    <button type="button" class="btn btn-primary" id="${i}-department" data-toggle="modal" onclick="fillEditFormLoc(${i}); $('#editLocationModal').modal('show');">
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-primary" id="${i}-department" data-toggle="modal" onclick="fillEditFormLoc(${i}); $('#deleteLocationModal').modal('show');">
                                                        <i class="fa-solid fa-trash" id="viewModal"></i>
                                                    </button>
                                                </td>
                <td style="display: none; width: 0;" id="${locationIdId}">${location.id}</td>
              </tr>`;
      
              $('#locationData').append(locationRow);
            });
             // Populate the select dropdown with location data
             $('#editDepartmentLocation').empty();
             locationData.forEach((location) => {
                 const option = `<option value="${location.id}" ${location.id === departmentLocation ? 'selected' : ''}>${location.name}</option>`;
                 $('#editDepartmentLocation').append(option);
             });
          }
        },
      
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
          console.log(errorThrown);
          console.log(jqXHR);
        }
      });

};
    
    
function fillEditForm(employeeNum) {
    const numToString = employeeNum.toString();
    currentId = $(`#${numToString}-id`).html();
     employeeName = $(`#${numToString}-employeeName`).html();
    const employeeEmail = $(`#${numToString}-employeeEmail`).html();
    const employeeJobTitle =  $(`#${numToString}-employeeJobTitle`).html();
    const employeeDepartment = $(`#${numToString}-employeeDepartment`).html();
    const employeeLocation = $(`#${numToString}-employeeLocation`).html();

    $('#selectedEmployeeName').html(employeeName);
    $('#selectedEmployeeEmail').html(employeeEmail);
    $('#selectedEmployeeJob').html(employeeJobTitle);
    $('#selectedEmployeeDepartment').html(employeeDepartment);
    $('#selectedEmployeeLocation').html(employeeLocation);
};
function fillEditFormDep(employeeNum) {
    departmentId = $(`#${employeeNum}-departmentId`).html();
   const departmentName = $(`#${employeeNum}-departmentName`).html();
   const departmentLocation = $(`#${employeeNum}-departmentLocation`).html();
   // console.log(departmentId);
   // console.log(departmentName);
   // console.log(departmentLocation);
   
   $('#editDepartmentName').val(departmentName);
   $('#editDepartmentLocation').val(departmentLocation);
   $('#deleteDepartmentName4').html(departmentName);
   $('#deleteDepartmentName2').html(departmentName);
   $('#deleteDepartmentName3').html(departmentName);
};
function fillEditFormLoc(locationNum) {
    locationId = $(`#${locationNum}-locationId`).html();
    const locationName = $(`#${locationNum}-locationName`).html();
    // console.log(locationId);
    // console.log(locationName);
    
    $('#editLocationName').val(locationName);
    $('#deleteLocationName4').html(locationName);
    $('#deleteLocationName2').html(locationName);
    $('#deleteLocationName3').html(locationName);
};
$('#editEmployeeButton').on('click', function() {

    // console.log(currentId);
    

    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: currentId
        }
    })
    .done(function(result) {
        if (result.status.name == "ok") {
            var departmentOptions = result.data.department.map(function(dept) {
                return '<option value="' + dept.id + '">' + dept.name + '</option>';
            }).join('');
            $('#editDepartment').html(departmentOptions);
    
            var personnel = result.data.personnel[0];
            $('#editFirstName').val(personnel.firstName);
            $('#editLastName').val(personnel.lastName);
            $('#editJob').val(personnel.jobTitle);
            $('#editEmail').val(personnel.email);
            $('#editDepartment').val(personnel.departmentID);
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
    });
});

$('#editEmployeeForm').submit(function() {
    event.preventDefault();
    $.ajax({
        url: "libs/php/updateEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            id: currentId,
            firstName: $('#editFirstName').val(),
            lastName: $('#editLastName').val(),
            email: $('#editEmail').val(),
            departmentID: $('#editDepartment').val(),
            jobTitle:$('#editJob').val()
        },
        success: function(result) {
            if (result.status.name == "ok") {
                updateTable();
                $('#alert.modal-body').html('');
                $('#alert .modal-body').html('The employee information has been updated successfully.');
                $('#alert').modal('show');
                setTimeout(function(){
                    $('#alert').modal('hide');
                }, 4000);
            };
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
});


$('#editDepartmentForm').submit(function() {
//    console.log($('#editDepartmentName').val());
//     console.log($('#editDepartmentLocation').val());
event.preventDefault();
    $.ajax({
        url: 'libs/php/updateDepartment.php',
        type: 'POST',
        data: {
          departmentId: departmentId,
          departmentName: $('#editDepartmentName').val(),
          departmentLocation: $('#editDepartmentLocation').val()
        },
        dataType: 'json',
        success: function(response) {

          // Handle success response
        //   console.log(response);
         updateTable();
        
         $('#alert.modal-body').html('');
        $('#alert .modal-body').html('Department has been updated successfully.');
        $('#alert').modal('show');
        setTimeout(function(){
            $('#alert').modal('hide');
        }, 4000);
          
        },
        error: function(xhr, status, error) {
          // Handle error response
          console.error(xhr);
          alert('Error updating department: ' + error);
        }
      });

});
$('#editLoactionForm').submit( function() {
    // console.log($('#editLocationName').val());
    // console.log(locationId);
    event.preventDefault();
    $.ajax({
        url: 'libs/php/updateLocation.php',
        type: 'POST',
        data: {
            id: locationId,
            locationName: $('#editLocationName').val()
        },
        dataType: 'json',
        success: function(response) {
            // Handle success response
            // console.log(response);
            updateTable();
            $('#alert.modal-body').html('');
                $('#alert .modal-body').html('Location updated successfully!');
                $('#alert').modal('show');
                setTimeout(function(){
                    $('#alert').modal('hide');
                }, 4000);
           
        },
        error: function(xhr, status, error) {
            // Handle error response
            console.error(xhr);
            alert('Error updating location: ' + error);
        }
    });
    
 
 });
  
$('#deleteEmployee').on('click', function() {


    $.ajax({
        url: "libs/php/deleteEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            id: currentId
        },

        success: function(result) {

            if (result.status.name == "ok") {
                updateTable();
                // location.reload(true);

            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});

$('#addEmployeeForm').submit(function() { 
    event.preventDefault();
    $.ajax({
        url: "libs/php/addEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            jobTitle: $('#newJobTitle').val(),
            email: $('#email').val(),
            departmentID: $('#department').val()
        },
    
        success: function(result) {
            if (result.status.name == "ok") {
                updateTable();
                // location.reload(true);
                
                $('#alert.modal-body').html('');
                $('#alert .modal-body').html('New Employee added successfully.');
                $('#alert').modal('show');
                setTimeout(function(){
                    $('#alert').modal('hide');
                }, 4000);
            }
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    
});
$('#newDepartmentForm').submit( function() {
    event.preventDefault();
    $.ajax({
        url: "libs/php/addDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            name: $('#departmentName').val(),
            locationID: $('#departmentLocation').val()
        },
    
        success: function(result) {
            if (result.status.name == "ok") {
                updateTable();
                // location.reload(true);
                // alert('A new department has been added.');
                $('#alert.modal-body').html('');
                $('#alert .modal-body').html('A new department has been added.');
                $('#alert').modal('show');
                setTimeout(function(){
                    $('#alert').modal('hide');
                }, 4000);
            }
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    
});

$('#addNewLocationForm').submit(function() {
    event.preventDefault();
    $.ajax({
        url: "libs/php/addLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: $('#locationName').val()
        },
    
        success: function(result) {
    
            if (result.status.name == "ok") {
    
                // console.log(result);
                updateTable();
                // alert('A new location has been added.');
                $('#alert.modal-body').html('');
                $('#alert .modal-body').html('A new location has been added.');
                $('#alert').modal('show');
                setTimeout(function(){
                    $('#alert').modal('hide');
                }, 4000);
                
            }
    
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
    
});
$('#deleteDepConfirmation').on('click' ,function() { 
    $.ajax({
      url: "libs/php/countEmployee.php",
      type: 'POST',
                dataType: 'json',
                data: {
                    id: departmentId,
                },
                success: function(result) {
                    // console.log(result);
                    entries = 0
                    if (result.status.name == "ok") {
                        entries=result['data']['0']['COUNT(id)'];
                        // console.log(entries);
                        $('#employeeCount').html(entries);
                        if(result['data']['0']['COUNT(id)'] == 0) {
                        //    console.log("department have no employees")
                           $.ajax({
                            url: "libs/php/deleteDepartment.php",
                            type: "POST",
                            dataType: "json",
                            data: {
                                departmentID: departmentId
                            },
                    
                            success: function(result) {
                    
                                if (result.status.name == "ok") {
                                    $('#deleteDepartmentConfrimationModal').modal('show');
                                    // location.reload(true);
                                    updateTable();
                                }
                    
                            },
                    
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(textStatus);
                                console.log(errorThrown);
                                console.log(jqXHR);
                            }
                        })
                        }
                        else {

                            $('#deleteDepartmentFailureModal').modal('show');
                            // console.log("This department still has dependencies and cannot be delete.")
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                }
    });
  });

  $('#deleteLocationConfirmation').on('click' ,function() { 
    $.ajax({
      url: "libs/php/countDepartments.php",
      type: 'POST',
                dataType: 'json',
                data: {
                    id: locationId,
                },
                success: function(result) {
                    // console.log(result);
                    entries = 0
                    if (result.status.name == "ok") {
                        entries=result['data']['0']['COUNT(id)'];
                        $('#departmentCount').html(entries);
                        // console.log(entries);
                        if(result['data']['0']['COUNT(id)'] == 0) {
                           console.log("location have no departments");
                           $.ajax({
                            url: "libs/php/deleteLocation.php",
                            type: "POST",
                            dataType: "json",
                            data: {
                                locationID: locationId
                            },
                    
                            success: function(result) {
                    
                                if (result.status.name == "ok") {
                                    $('#deleteLocationConfirmationModal').modal('show');
                                    updateTable();
                                    // location.reload(true);
                    
                                }
                    
                            },
                    
                            error: function(jqXHR, textStatus, errorThrown) {
                                console.log(textStatus);
                                console.log(errorThrown);
                                console.log(jqXHR);
                            }
                        })

                        }
                        else {
                            // console.log("This location still has departments and cannot be delete.")
                             $('#deleteLocationFailureModal').modal('show');
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                }
    });
  });
