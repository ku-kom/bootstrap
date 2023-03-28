/**
 * Parse RSS feed from https://ucph.jobteaser.com/
 * call getJobteaserRss('feed-url', 'element-id', number of items)
 */

const lang = window.navigator.userLanguage || window.navigator.language;

const clean = (str) => {
  return str.replaceAll('\n', '')
    .replaceAll('\t', '')
    .trim();
}

const getJobteaserRss = (source, id, max_items) => {
  if (!source && !id) {
    console.log('Specify feed url and result element id like this: getJobteaserRss("feed-url", "element-id)');
    return;
  }

  // Run through custom php proxy to avoid CORS issues:
  let url = 'https://cms.secure.ku.dk/instacms/parseFeeds/parseFeed.php?url=' + encodeURIComponent(source) + '&mimeType=application/rss+xml';

  // Max number of items to display:
  const max = Number(max_items) || null;

  // Where to display the results:
  const box = document.getElementById(id);

  fetch(url)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then((data) => {
      console.log(data);
      const items = data.querySelectorAll('item');
      let html = '';
      for (const [index, item] of items.entries()) {
        // Break after x number of items items:
        if (index === max) {
          break;
        }
        const link = clean(item.querySelector('link').textContent);
        const title = clean(item.querySelector('title').textContent);
        const desc = item.querySelector('description').textContent;
        const pubDate = item.querySelector('pubDate').textContent;
        let date = new Date(pubDate);
        const dato = date.getDate() + '. ' + date.toLocaleString(lang, {
          month: 'long'
        }) + ' ' + date.getFullYear();
        const companyNames = item.getElementsByTagName('jobOffer:companyName');
        let company = '';
        for (let i = 0; i < companyNames.length; i++) {
          company = companyNames[i].textContent;
        }
        const locations = item.getElementsByTagName('jobOffer:jobLocation');
        let location = '';
        for (let i = 0; i < locations.length; i++) {
          location = locations[i].textContent;
        }
        const img = item.querySelector('enclosure').getAttribute('url');
        html += `
            <li>
              <a href="${link}" target="_blank" rel="noopener"> 
                <div class="list-item">
                    <div class="list-img">
                        <img src="${img}" alt="">
                    </div>
                    <div class="list-body">
                        <h4 class="media-heading">${title}</h4>
                        <div class="jobinfo">${dato} | ${company}</div>
                        <div class="description">${desc}</div>
                        <div class="joblocation">${location}</div>
                    </div>
                    </div>
                </a>
            </li>
          `;
      }
      html = `<ul class="list-unstyled">${html}</ul>`;
      box.innerHTML = '';
      box.insertAdjacentHTML('beforeend', html);
    })
    .catch((error) => {
      box.innerHTML = 'Error fetching feed. Try again later.';
      console.log(error)
    });
};
