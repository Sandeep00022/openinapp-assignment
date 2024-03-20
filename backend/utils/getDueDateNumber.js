export function getDueDateNumber(dueDate) {
  var currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);

  var dueDateObj = new Date(dueDate);

  dueDateObj.setHours(0, 0, 0, 0);

  var timeDifference = dueDateObj.getTime() - currentDate.getTime();
  var dayDifference = Math.round(timeDifference / (1000 * 3600 * 24));

  return dayDifference;
}
