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
                // Sort the departments alphabetically by name
                result.data.sort((a, b) => a.name.localeCompare(b.name));
                
                // Add the departments as options to the select element
                result.data.forEach(dept => {
                    const optionEl = $('<option>', {
                        value: dept.id,
                        text: dept.name
                    });
                    $('#department').append(optionEl);
                });
                
                // Add the departments as options to the filter select element
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
                // Sort the locations alphabetically by name
                result.data.sort((a, b) => a.name.localeCompare(b.name));
                
                const newDepartmentLocationSelect = $('#newDepartmentLocation');
                const filterLocSelect = $('#filterLoc');
                const departmentLocationSelect = $('#departmentLocation');
                        
                result.data.forEach(location => {
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
                    fullName = ` ${employee.lastName}, ${employee.firstName}`;
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
                                            <td style="display: none; width: 0;" id="${employeeId}">${employee.id}</td>
                                            <td class="right">
                                               
                                                <button type="button" class="btn btn-primary" id="${i}-employee" onclick="fillEditForm(${i})" data-bs-toggle="modal" data-bs-target="#editEmployee" >
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-danger" id="${i}-employee" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" onclick="fillEditForm(${i})">
                                                        <i class="fa-solid fa-trash" id="viewModal"></i>
                                                    </button>
                                            </td>
                                            
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
                                                <td  style="display: none; width: 0;" id="${departmentId}">${department.department_id}</td>
                                                <td class="right">
                                                    <button type="button" class="btn btn-primary" id="${i}-department" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" onclick="fillEditFormDep(${i})">
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-danger" id="${i}-department"   onclick="fillEditFormDep(${i});deleteDepartmentfunction();">
                                                        <i class="fa-solid fa-trash" id="viewModal"></i>
                                                    </button>
                                                </td>
                                                
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
                <td style="display: none; width: 0;" id="${locationIdId}">${location.id}</td>
                <td class="right">
                                                    <button type="button" class="btn btn-primary" id="${i}-department" data-bs-toggle="modal" data-bs-target="#editLocationModal" onclick="fillEditFormLoc(${i})">
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-danger"  data-toggle="modal" onclick="fillEditFormLoc(${i}); deleteLocationfunction();">
                                                        <i class="fa-solid fa-trash" id="viewModal"></i>
                                                    </button>
                                                </td>
                
              </tr>`;
      
              $('#locationData').append(locationRow);
            });
             // Populate the select dropdown with location data
             $('#editDepartmentLocation').empty();
             locationData.sort((a, b) => a.name.localeCompare(b.name));

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

    $('#deleteDialog').html(`Are you sure you want to delete ${employeeName}?`);

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
            result.data.department.sort((a, b) => a.name.localeCompare(b.name));

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
};

$('#editEmployeeForm').submit(function(event) {
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
                $('#alert.modal-body').html('');
                $('#alert .modal-body').html(`${employeeName} Deleted!`);
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
$('#addEmployeeForm').submit(function(event) {
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
            if (result.status.name === "ok") {
                updateTable();
                // location.reload(true);
                var firstName = $('#firstName').val();
                var lastName = $('#lastName').val();
                $('#alert .modal-body').html(`${lastName}, ${firstName} added successfully.`);
                $('#alert').modal('show');
                setTimeout(function() {
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
$('#editDepartmentForm').submit(function(event) {
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
            const departmentN = $('#editDepartmentName').val();
             $('#alert.modal-body').html('');
            $('#alert .modal-body').html(`${departmentN} Department has been updated successfully.`);
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

    $('#newDepartmentForm').submit( function(event) {
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
                    const depName = $('#departmentName').val();
                    $('#alert.modal-body').html('');
                    $('#alert .modal-body').html(`${depName} department has been added.`);
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






$('#editLoactionForm').submit( function(event) {
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
            const locationN= $('#editLocationName').val();
            $('#alert.modal-body').html('');
                $('#alert .modal-body').html(`${locationN} Location updated successfully!`);
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
  



$('#addNewLocationForm').submit(function(event) {
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
                const locName=$('#locationName').val();
                $('#alert.modal-body').html('');
                $('#alert .modal-body').html(`${locName} location has been added.`);
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
function deleteDepartmentfunction(){
    $.ajax({
      url: "libs/php/countEmployee.php",
      type: 'POST',
                dataType: 'json',
                data: {
                    id: departmentId,
                },
                success: function(result) {
                    // console.log(result);
                   let entries = 0
                    if (result.status.name == "ok") {
                        entries=result['data']['0']['COUNT(id)'];
                        // console.log(entries);
                        $('#employeeCount').html(entries);
                        if(result['data']['0']['COUNT(id)'] == 0) {
                            $('#deleteDepartmentModal').modal('show');
                            
                            $('#deleteDepConfirmation').on('click', function() {
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

                            });

                        //    console.log("department have no employees")
                           
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
  };

  

    function deleteLocationfunction(){
    $.ajax({
      url: "libs/php/countDepartments.php",
      type: 'POST',
                dataType: 'json',
                data: {
                    id: locationId,
                },
                success: function(result) {
                    // console.log(result);
                    let entries = 0
                    if (result.status.name == "ok") {
                        entries=result['data']['0']['COUNT(id)'];
                        $('#departmentCount').html(entries);
                        // console.log(entries);
                        if(result['data']['0']['COUNT(id)'] == 0) {
                        //    console.log("location have no departments");
                           $('#deleteLocationModal').modal('show');
                            
                           $('#deleteLocationConfirmation').on('click', function() {
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
                    });
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
  };


  function focusFirstInput(modal, inputSelector) {
    modal.on('shown.bs.modal', function () {
      $(inputSelector).focus();
    });
  }
  
  focusFirstInput($('#editEmployee'), '#editFirstName');
  focusFirstInput($('#addEmployeeModal'), '#firstName');
  focusFirstInput($('#newDepartmentModal'), '#departmentName');
  focusFirstInput($('#editDepartmentModal'), '#editDepartmentName');
  focusFirstInput($('#newLocationModal'), '#locationName');
  focusFirstInput($('#editLocationModal'), '#editLocationName');

  const resetForm = (form) => form[0].reset();

  $('#addEmployeeModal').on('hidden.bs.modal', () => resetForm($('#addEmployeeForm')));
  $('#editEmployee').on('hidden.bs.modal', () => resetForm($('#editEmployeeForm')));
  $('#newDepartmentModal').on('hidden.bs.modal', () => resetForm($('#newDepartmentForm')));
  $('#editDepartmentModal').on('hidden.bs.modal', () => resetForm($('#editDepartmentForm')));
  $('#newLocationModal').on('hidden.bs.modal', () => resetForm($('#addNewLocationForm')));
  $('#editLocationModal').on('hidden.bs.modal', () => resetForm($('#editLoactionForm')));
  