/**
 * Parse RSS feed from https://ucph.jobteaser.com/
 * call getJobteaserRss('feed-url', 'element-id')
 */

const lang = window.navigator.userLanguage || window.navigator.language;

const clean = (str) => {
  return str.replaceAll('\n', '')
    .replaceAll('\t', '')
    .trim();
}

const getJobteaserRss = (source, id) => {
  if (!source && !id) {
    console.log('Specify var source = "feed url" and result element id');
    return;
  }

  const box = document.getElementById(id);
  let url = 'https://cms.secure.ku.dk/instacms/parseFeeds/parseFeed.php?url=' + encodeURIComponent(source) + '&mimeType=application/rss+xml';

  fetch(url)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, 'text/xml'))
    .then((data) => {
      console.log(data);
      const items = data.querySelectorAll('item');
      let html = '';
      items.forEach((item) => {
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
        html += `
            <li>
                <a href="${link}" target="_blank" rel="noopener">${title}</a><div class="small">${dato} | ${company}</div><div class="description">${desc}</div><div class="joblocation">${location}</div>
            </li>
          `;
      });
      html = `<ul class="list-unstyled">${html}</ul>`;
      box.innerHTML = '';
      box.insertAdjacentHTML('beforeend', html);
    })
    .catch((error) => {
      box.innerHTML = 'Error fetching feed. Try again later.';
      console.log(error)
    });
};
