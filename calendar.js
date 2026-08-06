document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const cmsItems = document.querySelectorAll('.calendar_data-item');
  
  if (!calendarEl) return;

  const events = [];

  cmsItems.forEach((item) => {
    const title = item.querySelector('.data-title')?.textContent.trim() || 'Training Session';
    const rawDate = item.querySelector('.data-date')?.textContent.trim();
    const startTime = item.querySelector('.data-time')?.textContent.trim() || '';
    const endTime = item.querySelector('.data-end-time')?.textContent.trim() || '';
    
    let zoomUrl = '';
    const urlEl = item.querySelector('.data-url');
    if (urlEl) {
      const textVal = urlEl.textContent.trim();
      const hrefVal = urlEl.getAttribute('href');
      
      if (textVal && textVal.startsWith('http')) {
        zoomUrl = textVal;
      } else if (hrefVal && hrefVal.startsWith('http')) {
        zoomUrl = hrefVal;
      }
    }

    if (rawDate) {
      const cleanDate = rawDate.replace(/\//g, '-');
      const startString = `${cleanDate} ${startTime}`.trim();
      const endString = endTime ? `${cleanDate} ${endTime}`.trim() : null;
      
      const startDateObj = new Date(startString);
      const endDateObj = endString ? new Date(endString) : null;

      events.push({
        title: title,
        start: isNaN(startDateObj.getTime()) ? rawDate : startDateObj.toISOString(),
        end: endDateObj && !isNaN(endDateObj.getTime()) ? endDateObj.toISOString() : undefined,
        allDay: false,
        extendedProps: {
          customZoomLink: zoomUrl
        }
      });
    }
  });

  let isOpening = false;

  // Helper to force Monthly List view on mobile and Month Grid view on desktop
  const checkResponsiveView = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && calendar.view.type !== 'listMonth') {
      calendar.changeView('listMonth');
    } else if (!isMobile && calendar.view.type === 'listMonth') {
      calendar.changeView('dayGridMonth');
    }
  };

  // 1. Initialize FullCalendar
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: window.innerWidth <= 768 ? 'listMonth' : 'dayGridMonth',
    
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    
    events: events,
    eventMinHeight: 48,
    slotEventOverlap: false,
    height: 'auto',
    
    eventDidMount: function(info) {
      if (info.event.extendedProps?.customZoomLink) {
        info.el.style.cursor = 'pointer';
      }
    },
    
    // 2. Automatically adjust view whenever the window or DevTools is resized
    windowResize: function() {
      checkResponsiveView();
    },
    
    eventClick: function(info) {
      info.jsEvent.preventDefault();
      info.jsEvent.stopPropagation();
      
      const targetUrl = info.event.extendedProps?.customZoomLink;

      if (targetUrl && targetUrl.startsWith('http')) {
        if (isOpening) return;
        isOpening = true;
        setTimeout(() => { isOpening = false; }, 1500);

        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
    }
  });

  calendar.render();
  
  // 3. Run check immediately after render to catch DevTools mobile simulation
  checkResponsiveView();
});
