export function checkDueDate(dueDate) {
  var currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  var dueDateObj = new Date(dueDate);

  dueDateObj.setHours(0, 0, 0, 0);

  if (dueDateObj < currentDate) {
    return false;
  } else {
    return true;
  }
}
