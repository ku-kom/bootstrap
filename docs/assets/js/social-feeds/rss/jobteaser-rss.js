  /**
   * Parse RSS from https://ucph.jobteaser.com/
   * Call function with feed argument:  getJobteaserRss('feed-url');
   */
  document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    const lang = window.navigator.userLanguage || window.navigator.language;

    const strip = (html) => {
        /**
         * Strip our html tags for safety.
         * @returns plain text
         */
        var tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
      }

    const getJobteaserRss = (source) => {

      if (!source) {
        console.log('Specify var source = "feed url"');
        return;
      }

      source = strip(source);

      let url = 'https://cms.secure.ku.dk/instacms/parseFeeds/parseFeed.php?url=' + encodeURIComponent(source) + '&mimeType=application/rss+xml';
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.overrideMimeType('application/rss+xml');
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseText != null) {
            //console.log(xhr.responseXML);
            var box = document.getElementById('feed');
            var ul = document.createElement('ul');
            ul.classList.add('list-unstyled');
            var xml = this.responseXML;
            var items = xml.documentElement.getElementsByTagName('item');
            for (var i = 0; i < items.length; i++) {
              var li = document.createElement('li');
              var item = items.item(i);
              var pubDate = item.getElementsByTagName('pubDate').item(0).textContent;
              var date = new Date(pubDate);
              var dato = date.getDate() + '. ' + date.toLocaleString(lang, {
                month: 'long'
              }) + ' ' + date.getFullYear();
              var title = item.getElementsByTagName('title').item(0).textContent;
              var link = item.getElementsByTagName('link').item(0).textContent;
              var description = item.getElementsByTagName('description').item(0).textContent;
              var company = item.getElementsByTagNameNS('*', 'companyName').item(0).textContent;
              var loc = item.getElementsByTagNameNS('*', 'jobLocation').item(0).textContent;

              li.innerHTML = '<a href="' + link + '" target="_blank" rel="noopener">' + title + '</a><div class="small">' + dato + ' | ' + company + '</div><div class="description">' + description + '</div><div class="joblocation">' + loc + '</div>';
              ul.appendChild(li);
            }
            box.innerHTML = '';
            box.appendChild(ul);
          } else {
            console.log('Error code ' + xhr.status + ' received: ' + xhr.statusText);
          }
        }
      }
      xhr.send(null);
    }

  }, false);
