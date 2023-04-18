const menuClick = document.querySelector("#menuButton");
const navDropdown = document.querySelector("#dropdownContainer");

menuClick.addEventListener("click", function() {
    menuClick.classList.toggle("active");
    navDropdown.classList.toggle("visible");
});




// Declare variables
var currentId;
var employeeName;
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
    var dept = rows[i].getElementsByTagName("td")[2];
    if (filters.filterDept !== "" && dept) {
      var deptValue = dept.textContent || dept.innerText;
      if (deptValue !== filters.filterDept) {
        deptMatch = false;
      }
    }

    // Check Location filter
    var loc = rows[i].getElementsByTagName("td")[3];
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
    $('#addEmployee').modal('show');
})
$('#deleteEmployeePromt').on('click', function() {
    $('#deleteDialog').html(`Are you sure you want to delete ${employeeName}?`);
    $('#deleteEmployeeModal').modal('show');
})
$('#manageDepartment').on('click', function() {
    $('#manageDepartmentsModal').modal('show');
})
$('#addNewDepartment').on('click', function() {
    $('#newDepartmentModal').modal('show');
})
$('#manageLocation').on('click', function() {
    $('#manageLocationModal').modal('show');
})
$('#addNewLocation').on('click', function() {
    $('#newLocationModal').modal('show');
})
$('#resetButton').on('click', function() {
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
                console.log(location.id);
                console.log(location.name); 
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
                    const employeeId = `${i}-id`;
    
                    const employeeRow = `<tr>
                                            <td id="${employeeNameId}">${fullName}</td>
                                            <td id="${employeeEmailId}">${employee.email}</td>
                                            <td id="${employeeDeptId}" class="depFilter">${employee.department}</td>
                                            <td id="${employeeLocId}">${employee.location}</td>
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
    
});
function fillEditForm(employeeNum) {
    const numToString = employeeNum.toString();
    currentId = $(`#${numToString}-id`).html();
     employeeName = $(`#${numToString}-employeeName`).html();
    const employeeEmail = $(`#${numToString}-employeeEmail`).html();
    const employeeJobTitle = $(`#${numToString}-employeeJobTitle`).html();
    const employeeDepartment = $(`#${numToString}-employeeDepartment`).html();
    const employeeLocation = $(`#${numToString}-employeeLocation`).html();

    $('#selectedEmployeeName').html(employeeName);
    $('#selectedEmployeeEmail').html(employeeEmail);
    $('#selectedEmployeeJobTitle').html(employeeJobTitle);
    $('#selectedEmployeeDepartment').html(employeeDepartment);
    $('#selectedEmployeeLocation').html(employeeLocation);
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
departments();
locations();
$('#editEmployeeForm').submit(function() {

    $.ajax({
        url: "libs/php/updateEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            id: currentId,
            firstName: $('#editFirstName').val(),
            lastName: $('#editLastName').val(),
            email: $('#editEmail').val(),
            departmentID: $('#editDepartment').val()
        },
        success: function(result) {
            if (result.status.name == "ok") {
                location.reload(true);
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
        url: "libs/php/deleteEmployeeByID.php",
        type: "POST",
        dataType: "json",
        data: {
            id: currentId
        },

        success: function(result) {

            if (result.status.name == "ok") {

                location.reload(true);

            }

        },

        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
});

$('#addEmplyeeSubmit').on('click',function() { 

    $.ajax({
        url: "libs/php/addEmployee.php",
        type: "POST",
        dataType: "json",
        data: {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            departmentID: $('#department').val()
        },
    
        success: function(result) {
            if (result.status.name == "ok") {
                location.reload(true);
            }
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    
});
$('#newDepartmentSave').on('click', function() {

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
                location.reload(true);
            }
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    });
    
});
$('#newLocationSave').on('click', function() {

    $.ajax({
        url: "libs/php/addLocation.php",
        type: "POST",
        dataType: "json",
        data: {
            name: $('#locationName').val()
        },
    
        success: function(result) {
    
            if (result.status.name == "ok") {
    
                console.log(result);
                
                location.reload(true);
            }
    
        },
    
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(errorThrown);
            console.log(jqXHR);
        }
    })
    
});