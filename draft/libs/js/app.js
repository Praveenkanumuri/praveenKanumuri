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
// var currentId;
// var employeeName;
// var departmentId;
// var departmentName;
// var locationId;
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




// $('#editEmployeeButton').on('click', function() {
//     $('#editEmployee').modal('show');
// })
$('#addEmployeeButton').on('click', function() {
    $('#addEmployeeModal').modal('show');
})
// $('#deleteEmployeePromt').on('click', function() {
//     $('#deleteDialog').html(`Are you sure you want to delete ${employeeName}?`);
//     $('#deleteEmployeeModal').modal('show');
// })
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
    // departments();
    // locations();
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
                    fullName = `${employee.lastName}, ${employee.firstName} `;
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
                                        
                                                <button type="button" class="btn btn-primary" id="${i}-employee" data-bs-toggle="modal" data-bs-target="#editEmployee" data-id="${employee.id}" >
                                                <i class="fa-solid fa-pen" id="viewModal"></i>
                                            </button>
                                            <button type="button" class="btn btn-danger" id="${i}-employee" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" data-id="${employee.id}" data-num=${i} >
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
                                                <td>
                                                    <button type="button" class="btn btn-primary" id="${i}-department" data-bs-toggle="modal" data-num=${i} data-id="${department.department_id}" data-bs-target="#editDepartmentModal">
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-primary" id="${i}-department" data-bs-toggle="modal"  data-num=${i}  data-id="${department.department_id}"  onclick="deleteDepName(${i});deleteDep(${department.department_id});">
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

    $('#locationData').empty();
    $.ajax({
        url: "libs/php/getLocations.php",
        type: "GET",
        dataType: "json",
        success: function(result) {
          if (result.status.name === "ok") {
            $('#locationData').empty();
            const locationData = result.data;
      
            locationData.forEach((location, i) => {
              const locationNameId = `${i}-locationName`;
              const locationIdId = `${i}-locationId`;
      
              const locationRow = `<tr>
                <td id="${locationNameId}">${location.name}</td>
                <td>
                                                    <button type="button" class="btn btn-primary" id="${i}-location" data-bs-toggle="modal"  data-bs-target="#editLocationModal"  data-id="${location.id}" data-num=${i}>
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-primary" id="deleteLoc" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="${location.id}" data-num=${i}>
                                                        <i class="fa-solid fa-trash" id="viewModal"></i>
                                                    </button>
                                                </td>
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
    
    
// function fillEditForm(employeeNum) {
//     const numToString = employeeNum.toString();
//     currentId = $(`#${numToString}-id`).html();
//      employeeName = $(`#${numToString}-employeeName`).html();
//     const employeeEmail = $(`#${numToString}-employeeEmail`).html();
//     const employeeJobTitle =  $(`#${numToString}-employeeJobTitle`).html();
//     const employeeDepartment = $(`#${numToString}-employeeDepartment`).html();
//     const employeeLocation = $(`#${numToString}-employeeLocation`).html();

//     $('#selectedEmployeeName').html(employeeName);
//     $('#selectedEmployeeEmail').html(employeeEmail);
//     $('#selectedEmployeeJob').html(employeeJobTitle);
//     $('#selectedEmployeeDepartment').html(employeeDepartment);
//     $('#selectedEmployeeLocation').html(employeeLocation);
// };
// function fillEditFormDep(employeeNum) {
//     departmentId = $(`#${employeeNum}-departmentId`).html();
//    const departmentName = $(`#${employeeNum}-departmentName`).html();
//    const departmentLocation = $(`#${employeeNum}-departmentLocation`).html();
//    // console.log(departmentId);
//    // console.log(departmentName);
//    // console.log(departmentLocation);
   
//    $('#editDepartmentName').val(departmentName);
//    $('#editDepartmentLocation').val(departmentLocation);
//    $('#deleteDepartmentName4').html(departmentName);
//    $('#deleteDepartmentName2').html(departmentName);
//    $('#deleteDepartmentName3').html(departmentName);
// };
// function fillEditFormLoc(locationNum) {
//     locationId = $(`#${locationNum}-locationId`).html();
//     const locationName = $(`#${locationNum}-locationName`).html();
//     // console.log(locationId);
//     // console.log(locationName);
    
//     $('#editLocationName').val(locationName);
//     $('#deleteLocationName4').html(locationName);
//     $('#deleteLocationName2').html(locationName);
//     $('#deleteLocationName3').html(locationName);
// };
$('#editEmployee').on('show.bs.modal', function (e) {

    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr('data-id')
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


$('#editEmployeeForm').submit(function() {
    event.preventDefault();
    $.ajax({
        url: "libs/php/updateEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr('data-id'),
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
});
$('#editDepartmentModal').on('show.bs.modal', function (e) {
    const employeeNum = $(e.relatedTarget).attr('data-num');
const departmentId = $(`#${employeeNum}-departmentId`).html();
const departmentName = $(`#${employeeNum}-departmentName`).html();
const departmentLocation = $(`#${employeeNum}-departmentLocation`).html();

   console.log(employeeNum);
   console.log(departmentName);
   console.log(departmentLocation);
   console.log($(e.relatedTarget).attr('data-id'));
   console.log($(this).attr("data-id"));
   
   $('#editDepartmentName').val(departmentName);
   $('#editDepartmentLocation').val(departmentLocation);
   $('#deleteDepartmentName4').html(departmentName);
   $('#deleteDepartmentName2').html(departmentName);
   $('#deleteDepartmentName3').html(departmentName);

 
        $('#editDepartmentForm').submit(function() {
        //    console.log($('#editDepartmentName').val());
        //     console.log($('#editDepartmentLocation').val());
        event.preventDefault();
            $.ajax({
                url: 'libs/php/updateDepartment.php',
                type: 'POST',
                data: {
                  departmentId: $(e.relatedTarget).attr('data-id'),
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
    
 });
 function deleteDepName(depNum) {
    const employeeNum =depNum;
        const departmentName = $(`#${employeeNum}-departmentName`).html();

        $('#deleteDepartmentName4').html(departmentName);
        $('#deleteDepartmentName2').html(departmentName);
        $('#deleteDepartmentName3').html(departmentName);
 }

    function deleteDep(depId) {
        
        

    $.ajax({
      url: "libs/php/countEmployee.php",
      type: 'POST',
      dataType: 'json',
      data: {
        id:  depId
      },
      success: function(result) {
        entries = 0;
        if (result.status.name == "ok") {
          entries = result['data']['0']['COUNT(id)'];
          $('#employeeCount').html(entries);
          if (entries == 0) {
            $('#deleteDepartmentModal').modal('show');
            $('#deleteDepConfirmation').on('click', function() {
              $.ajax({
                url: "libs/php/deleteDepartment.php",
                type: "POST",
                dataType: "json",
                data: {
                  departmentID: depId
                },
                success: function(result) {
                  if (result.status.name == "ok") {
                    $('#deleteDepartmentConfrimationModal').modal('show');
                    updateTable();
                  }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                  console.log(textStatus);
                  console.log(errorThrown);
                  console.log(jqXHR);
                }
              });
            });
          } else {
            
            $('#deleteDepartmentFailureModal').modal('show');
            // console.log("This department still has dependencies and cannot be deleted.")
          }
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      }
    });
  };
  
  
 
  $('#editLocationModal').on('show.bs.modal', function (e) {
    // Check if there are any other modals open
    if ($('.modal.show').length > 0) {
        // Close all other open modals
        $('.modal.show').modal('hide');
    }
    
    // Get location details from related target
    const locationNum = $(e.relatedTarget).attr('data-num');
    const locationId = $(e.relatedTarget).attr('data-id');
    const locationName = $(`#${locationNum}-locationName`).html();

    console.log(locationNum);
    console.log(locationId);
    console.log(locationName);
    
    // Set location details in the modal
    $('#editLocationName').val(locationName);
    $('#deleteLocationName4, #deleteLocationName2, #deleteLocationName3').html(locationName);
    
    // Handle form submission
    $('#editLocationForm').on('submit', function() {
        event.preventDefault();
        
        // Send AJAX request to update location
        $.ajax({
            url: 'libs/php/updateLocation.php',
            type: 'POST',
            data: {
                id: locationId,
                locationName: $('#editLocationName').val()
            },
            dataType: 'json',
            success: function(response) {
                 console.log(parseInt(locationId));
                 
                $('#locationData').empty();
                // Update table and show success message
                
                $('#alert.modal-body').html('');
                $('#alert .modal-body').html('Location updated successfully!');
                $('#alert').modal('show');
                setTimeout(function(){
                    $('#alert').modal('hide');
                }, 4000);
                updateTable();
            },
            error: function(xhr, status, error) {
                // Handle error response
                console.error(xhr);
                alert('Error updating location: ' + error);
            }
        });
    });
});



$('#deleteEmployeeModal').on('show.bs.modal', function (e) {
    const employeeNumber= $(e.relatedTarget).attr('data-num');
    const numToString = employeeNumber.toString();
    const employeeNameA = $(`#${numToString}-employeeName`).html();




    $('#deleteDialog').html(`Are you sure you want to delete ${employeeNameA}?`);


$('#deleteEmployee').on('click', function() {


    $.ajax({
        url: "libs/php/deleteEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).attr('data-id')
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
