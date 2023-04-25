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

  // Event listener for Department filter
$('#filterDept').on('change', function() {
    var selectedOption = $(this).find('option:selected');
    filters.filterDept = selectedOption.text() === 'Filter Departments' ? '' : selectedOption.text();
    filterRows();
  });
  
  // Event listener for Location filter
  $('#filterLoc').on('change', function() {
    var selectedOption = $(this).find('option:selected');
    filters.filterLoc = selectedOption.text() === 'Filter Locations' ? '' : selectedOption.text();
    filterRows();
  });
  


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
function updateTable() {
    $('#personnelData').empty();
    $('#departmentData').empty();
    $('#locationData').empty();
    $('#filterDept').find('option:not(#depaFilter)').remove();

    $('#department').empty();
    $('#newDepartmentLocation').empty();
    $('#filterLoc').find('option:not(#locaFilter)').remove();

    $('#departmentLocation').empty();
     
    departments();
    locations();
    subimt();
    $.ajax({
        url: "libs/php/getAll.php",
        type: "GET",
        dataType: "json",
    
        success: function(result) {
            if (result.status.name === "ok") {
                const employeeData = result.data;
    
                employeeData.forEach((employee, i) => {
                    const fullName = ` ${employee.lastName}, ${employee.firstName}`;
                    const employeeNameId = `${i}-employeeName`;
                    const employeeEmailId = `${i}-employeeEmail`;
                    const employeeDeptId = `${i}-employeeDepartment`;
                    const employeeLocId = `${i}-employeeLocation`;
                    const employeeJobTitleId = `${i}-employeeJobTitle`;
                
    
                    const employeeRow = `<tr>
                                            <td id="${employeeNameId}">${fullName}</td>
                                            <td class="style2" id="${employeeEmailId}">${employee.email}</td>
                                            <td class="style2" id="${employeeJobTitleId}">${employee.jobTitle}</td>
                                            <td class="style3" id="${employeeDeptId}" class="depFilter">${employee.department}</td>
                                            <td class="style4" id="${employeeLocId}">${employee.location}</td>
                                            <td class="right">
                                               
                                                <button type="button" class="btn btn-primary"    data-bs-toggle="modal" data-bs-target="#editEmployee" data-id="${employee.id}" >
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-danger deleteEmpBtn"  data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal"  data-id="${employee.id}">
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
    $('#departmentData').empty();
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
        
                    const departmentRow = `<tr>
                                                <td id="${departmentNameId}">${department.department_name}</td>
                                                <td class="style3" id="${departmentLocId}">${department.location_name}</td>
                                                <td class="right">
                                                    <button type="button" class="btn btn-primary"  data-bs-toggle="modal" data-bs-target="#editDepartmentModal"  data-id="${department.department_id}">
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-danger deleteDepBtn"  data-id="${department.department_id}" >
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
      
              const locationRow = `<tr>
                <td id="${locationNameId}">${location.name}</td>
                <td class="right">
                                                    <button type="button" class="btn btn-primary" i data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${location.id}" >
                                                        <i class="fa-solid fa-pen" id="viewModal"></i>
                                                    </button>
                                                    <button type="button" class="btn btn-danger deleteLocBtn "  data-id="${location.id}"  data-toggle="modal" >
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

$(document).ready(function() { 
    updateTable();
    
});

    
$('#editEmployee').on('show.bs.modal', function (e) {
    subimt();
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
            result.data.department.sort((a, b) => a.name.localeCompare(b.name));

            var departmentOptions = result.data.department.map(function(dept) {
             return '<option value="' + dept.id + '">' + dept.name + '</option>';
            }).join('');

            $('#editDepartment').html(departmentOptions);

    
            var personnel = result.data.personnel[0];

            $('#departmentEditID').val(personnel.id);
            var employeeName= ` ${personnel.lastName}, ${personnel.firstName}`;
            $('#deleteDialog').html(`Are you sure you want to delete ${employeeName}?`);
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

$('#editEmployeeForm').submit(function(event) {
    event.preventDefault();
    $.ajax({
        url: "libs/php/updateEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $('#departmentEditID').val(),
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
                $('#alert .modal-body').html(` ${$('#editLastName').val()}, ${$('#editFirstName').val()} information has been updated successfully.`);
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
$(document).on("click", ".deleteEmpBtn", function(e) {
    $.ajax({
        url: "libs/php/getPersonnelByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $(this).attr("data-id")
        }
    })
    .done(function(result) {
        if (result.status.name == "ok") {
    
            var personnel = result.data.personnel[0];
            var personnelId= personnel.id;
            $('#employeeDeleteID').val(personnel.id);
           
            var employeeName= ` ${personnel.lastName}, ${personnel.firstName}`;
            $('#employeeDeleteName').val(employeeName);
            
            $('#deleteDialog').html(`Are you sure you want to delete ${employeeName}?`);
           
        }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);
        console.log(errorThrown);
        console.log(jqXHR);
    });
});
$('#deleteEmployee').on('click', function() {

    $.ajax({
        url: "libs/php/deleteEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            id: $('#employeeDeleteID').val()
        },

        success: function(result) {

            if (result.status.name == "ok") {
             

                updateTable();
                const name = $('#employeeDeleteName').val()
                $('#alert.modal-body').html('');
                $('#alert .modal-body').html(`${name} Deleted!`);
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
$('#editDepartmentModal').on('show.bs.modal', function (e) {
    subimt()
    
    $.ajax({
        url: "libs/php/getDepartmentById.php",
        type: "GET",
        dataType: "json",
        data: {
            departmentID: $(e.relatedTarget).attr('data-id')
        },
        success: function(result) {
            if (result.status.name == "ok") {
                var departmentDetails = result.data.departmentDetails[0];
                $('#departmentEditID').val(departmentDetails.departmentID);
                $('#editDepartmentName').val(departmentDetails.departmentName);
                $('#editDepartmentID').val(departmentDetails.departmentID);
                $('#editDepartmentLocation').val(departmentDetails.locationID);
                $('#editLocation').val(departmentDetails.location);
                $('#editLocationID').val(departmentDetails.locationID);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    
});

$('#editDepartmentForm').submit(function(event) {
    
    event.preventDefault();

    $.ajax({
        url: 'libs/php/updateDepartment.php',
        type: 'POST',
        data: {
          departmentId: $('#departmentEditID').val(),
          departmentName: $('#editDepartmentName').val(),
          departmentLocation: $('#editDepartmentLocation').val()
        },
        dataType: 'json',
        success: function(response) {


            updateTable();
            const dName=$('#editDepartmentName').val();
        $('#alert.modal-body').html('');
        $('#alert .modal-body').html(`${dName} Department has been updated successfully.`);
        $('#alert').modal('show');
        setTimeout(function(){
            $('#alert').modal('hide');
        }, 4000);
          
        },
        error: function(xhr, status, error) {
          
          console.error(xhr);
          alert('Error updating department: ' + error);
        }
      });

 });
 
 $(document).on("click", ".deleteDepBtn", function() {
    
    $.ajax({
        url: "libs/php/getDepartmentById.php",
        type: "GET",
        dataType: "json",
        data: {
            departmentID: $(this).attr("data-id")
        },
        success: function(result) {
            if (result.status.name == "ok") {
                var departmentDetails = result.data.departmentDetails[0];
                $('#departmentDeleteID').val(departmentDetails.departmentID);
                $('#departmentDeleteName').val(departmentDetails.departmentName);
                $('#deleteDepartmentName4').html(departmentDetails.departmentName);
                $('#deleteDepartmentName2').html(departmentDetails.departmentName);
                $('#deleteDepartmentName3').html(departmentDetails.departmentName);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    $.ajax({
      url: "libs/php/countEmployee.php",
      type: 'POST',
                dataType: 'json',
                data: {
                    id: $(this).attr("data-id")
                },
                success: function(result) {
                   let entries = 0
                    if (result.status.name == "ok") {
                        entries=result['data']['0']['COUNT(id)'];
                        $('#employeeCount').html(entries);
                        if(result['data']['0']['COUNT(id)'] == 0) {
                            $('#deleteDepartmentModal').modal('show');
     
                        }
                        else {

                            $('#deleteDepartmentFailureModal').modal('show');
 
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                }
    });
  });

  $('#deleteDepConfirmation').on('click', function() {
    $.ajax({
        url: "libs/php/deleteDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
            departmentID:  $('#departmentDeleteID').val(),
        },
    
        success: function(result) {
    
            if (result.status.name == "ok") {
                updateTable();
                const dpName = $('#departmentDeleteName').val();
                $('#alert.modal-body').html('');
                    $('#alert .modal-body').html(`${dpName} department has been deleted.`);
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


$('#editLocationModal').on('show.bs.modal', function (e) { 
    subimt();
    $.ajax({
        url: "libs/php/getLocationById.php",
        type: "GET",
        dataType: "json",
        data: {
            locationID: $(e.relatedTarget).attr('data-id')
        },
        success: function(result) {
            if (result.status.name == "ok") {
                var locationDetails = result.data.locationDetails[0];
                $('#locationEditID').val(locationDetails.locationID);
                $('#editLocationName').val(locationDetails.locationName);
               
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    
});







$('#editLoactionForm').submit( function(event) {
    event.preventDefault();
    $.ajax({
        url: 'libs/php/updateLocation.php',
        type: 'POST',
        data: {
            id: $('#locationEditID').val(),
            locationName: $('#editLocationName').val()
        },
        dataType: 'json',
        success: function(response) {

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

$(document).on("click", ".deleteLocBtn", function() {
    $.ajax({
        url: "libs/php/getLocationById.php",
        type: "GET",
        dataType: "json",
        data: {
            locationID: $(this).attr("data-id")
        },
        success: function(result) {
            if (result.status.name == "ok") {
                var locationDetails = result.data.locationDetails[0];
                
                
                $('#locationDeleteID').val(locationDetails.locationID);
                $('#locationDeleteName').val(locationDetails.locationName);
                $('#deleteLocationName2').html(locationDetails.locationName);
                $('#deleteLocationName4').html(locationDetails.locationName);
              
               
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });


    $.ajax({
        url: "libs/php/countDepartments.php",
        type: 'POST',
                  dataType: 'json',
                  data: {
                      id: $(this).attr("data-id")
                  },
                  dataType: 'json',
                  success: function(result) {
                      // console.log(result);
                      let entries = 0
                      if (result.status.name == "ok") {
                          entries=result['data']['0']['COUNT(id)'];
                          $('#departmentCount').html(entries);

                          if(result['data']['0']['COUNT(id)'] == 0) {

                             $('#deleteLocationModal').modal('show');
                              
                          }
                          else {

                               $('#deleteLocationFailureModal').modal('show');
                          }
                      }
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                  console.log(jqXHR.responseText);
                  }
      });
  });


  $('#deleteLocationConfirmation').on('click', function() {
    $.ajax({
     url: "libs/php/deleteLocation.php",
     type: "POST",
     dataType: "json",
     data: {
         locationID: $('#locationDeleteID').val()
     },

     success: function(result) {

         if (result.status.name == "ok") {
              updateTable();    
              const nameL= $('#locationDeleteName').val();
             $('#alert.modal-body').html('');
             $('#alert .modal-body').html(`${nameL} location has been deleted.`);
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

$('#addEmployeeModal').on('show.bs.modal', function (e) { subimt();});
$('#newDepartmentModal').on('show.bs.modal', function (e) { subimt(); });
$('#newLocationModal').on('show.bs.modal', function (e) {  subimt();});
function focusFirstInput(modalID, inputSelector) {
    $(modalID).on('shown.bs.modal', function () {
      $(inputSelector).focus();
    });
  }
  
  function resetFormOnHide(modalID, formID) {
    $(modalID).on('hidden.bs.modal', () => $(formID)[0].reset());
  }
  
  const modalsAndInputs = [
    { modal: '#editEmployee', input: '#editFirstName', form: '#editEmployeeForm' },
    { modal: '#addEmployeeModal', input: '#firstName', form: '#addEmployeeForm' },
    { modal: '#newDepartmentModal', input: '#departmentName', form: '#newDepartmentForm' },
    { modal: '#editDepartmentModal', input: '#editDepartmentName', form: '#editDepartmentForm' },
    { modal: '#newLocationModal', input: '#locationName', form: '#addNewLocationForm' },
    { modal: '#editLocationModal', input: '#editLocationName', form: '#editLoactionForm' },
  ];
  
  modalsAndInputs.forEach(({ modal, input, form }) => {
    focusFirstInput(modal, input);
    resetFormOnHide(modal, form);
  });

function subimt() {
        function isValidEmail(email) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
            return emailRegex.test(email);
            }
      
      function checkRequiredFields(fields) {
        let allFilled = true;
        fields.each(function() {
          const isEmailField = $(this).attr('type') === 'email';
          const fieldValue = $(this).val();
      
          if (fieldValue === '' || fieldValue === 'reset' || (isEmailField && !isValidEmail(fieldValue))) {
            allFilled = false;
          }
        });
        return allFilled;
      }
      
      function setButtonState(formID, buttonID) {
        const requiredFields = $(`${formID} input[required], ${formID} select[required]`);
        const submitButton = $(buttonID);
      
        submitButton.prop('disabled', true);
      
        requiredFields.on('input change', function() {
          if (checkRequiredFields(requiredFields)) {
            submitButton.prop('disabled', false);
          } else {
            submitButton.prop('disabled', true);
          }
        });
      }
      
      setButtonState('#addEmployeeForm', '#addEmployeeSubmit');
      setButtonState('#editEmployeeForm', '#editEmployeeForm button[type="submit"]');
      setButtonState('#newDepartmentForm', '#newDepartmentSave');
      setButtonState('#editDepartmentForm', '#updateDepartment');
      setButtonState('#addNewLocationForm', '#newLocationSave');
      setButtonState('#editLoactionForm', '#updateLocation');
      
  
};
