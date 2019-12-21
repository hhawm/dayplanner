// Times are supposed to be 9 AM til 5 PM, but went to midnight for testing
const times = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

// Updates past, present, future time-blocks every 30 seconds
const timeBlockCheck = 30000;
var updateInterval;

// Sets current day from moment function
var curDate = moment().clone();

// Sets current day in the header
function setCurrentDateLabel() {
    $("#currentDay").text(curDate.format('dddd, MMMM Do'));
}

// Saves date and description into localstorage
function handleSave() {
    var saveInLocal = $(this).siblings(".description");
    var hour = saveInLocal.attr("data-hour");
    var text = saveInLocal.val();
    localStorage.setItem(getStoreDatePrefix() + hour.trim(), text.trim());
    $("#updating").fadeIn(100).fadeOut(1000);
}

// Loads current day onto the page with 5 second fade-in
function loadDay(fadeTime = 500) {
    clearInterval(updateInterval);

    $(".container").html(""); // Clear out old data
    // Creates time-blocks (from CONSTANT at top)
    for (var i = 0; i < times.length; i++) {
        $(".container").append(createTimeBlock(times[i]));
    }

    // Updates past, present, future time-blocks every 30 seconds(set up at top)
    updateInterval = setInterval(checkTimeBlocks, timeBlockCheck);

    // Changes opacity of description on hover
    $('.description').hover(function () {
        $(this).toggleClass("active");
    });
    // Changes opacity of save button on hover
    $('.saveBtn').hover(function () {
        $(this).toggleClass("active");
    });

    $(".container").hide().fadeIn(fadeTime);
}

// Sets timeblocks COLORS to PAST PRESENT or FUTURE
function checkTimeBlocks() {
    console.log("Check Time Blocks Active");
    var $descriptions = $('.description');
    $descriptions.each(function (index) {
        var hour12 = $(this).attr("data-hour"); // Gets hour
        var t = getMoment12H(hour12);
        var tense = getTense(t);
        if ($(this).hasClass(tense)) {
            console.log("NO CHANGE");
        } else if (tense === "present") {
            $(this).removeClass("past future");
        } else if (tense === "past") {
            $(this).removeClass("present future");
        } else if (tense === "future") {
            $(this).removeClass("past present");
        }
        $(this).addClass(tense);
    });
}

// Creates rows and columns for container
function createTimeBlock(hour24) {
    var row = createEl("div", "row");
    var timeBlock = createEl("div", "time-block");
    timeBlock.appendChild(row);
    var colHour = createEl("div", "col-sm-1 col-12 pt-3 hour", hour24);
    row.appendChild(colHour);
    var colText = createEl("textarea", "col-sm-10 col-12 description", hour24);
    row.appendChild(colText);
    var colSave = createEl("div", "col-sm-1 col-12 saveBtn");
    row.appendChild(colSave);
    // Disk icon from fontawesome.com
    var iconSave = createEl("i", "far fa-save");
    colSave.appendChild(iconSave);

    return timeBlock;
}

// Creates a single page element
// tag = tag to create 
// cls = classes to assign
// hour24 = the current hour (only used by hour and description classes)
function createEl(tag, cls, hour24) {
    var el = document.createElement(tag);
    // Special Handling for Hour and Description Columns which need the hour
    if (hour24) {
        var t = getMoment24H(hour24);
        var displayHour = formatAmPm(t);
        if (cls.includes("description")) {
            // Descriptions class
            cls += " " + getTense(t);
            el.textContent = localStorage.getItem(getStoreDatePrefix() + displayHour);
            el.setAttribute("data-hour", displayHour);
        } else {
            // Hours class
            el.textContent = displayHour.padEnd(4, " ");
        }
    }
    // Sets classes on the element
    el.setAttribute("class", cls);
    return el;
}

// Sets CLASS to PAST PRESENT FUTURE compared to current time
// t = hour moment
// Returns appropriate tense class (past, present, or future)
function getTense(t) {
    var cls;
    var n = moment();

    if (n.isSame(t, "hour") &&
        n.isSame(t, "day") &&
        n.isSame(t, "month") &&
        n.isSame(t, "year")) {
        cls = "present";
    } else if (n.isAfter(t)) {
        cls = "past"
    } else {
        cls = "future";
    }
    return cls;
}

// Gets curDate string from localstorage
function getStoreDatePrefix() {
    return curDate.format("YYYYMMDD-");
}

// Returns a 12-hour AM/PM time string
function formatAmPm(m) {
    return m.format("h A");
}


// Creates new moment based off curDate and a 12hr AM/PM format
function getMoment12H(hour12) {
    return moment(curDate.format("YYYYMMDD ") + hour12, "YYYYMMDD hA");
}

// Creates new moment based off curDate and a 24hr format
function getMoment24H(hour24) {
    return moment(curDate.format("YYYYMMDD ") + hour24, "YYYYMMDD H");
}

// Document Ready
$(function () {
    // Sets date in the header
    setCurrentDateLabel();

    // Saves time and description 
    $(".container").on("click", ".saveBtn", handleSave);

    // Loads current day 
    loadDay();
})