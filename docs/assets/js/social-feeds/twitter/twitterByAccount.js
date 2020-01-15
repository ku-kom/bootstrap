/*jslint latedef:false*/
/* <div id="twitter-feed" data-account="koebenhavns_uni" data-tweets="1">
 * <div class="ku-loading" role="status">
 * <span class="sr-only">Loading...</span>
 *  </div>
 * <ul class="list-unstyled"></ul></div>
 */
(function ($) {
  'use strict';
  $(document).ready(function () {
    // Run
    gettwitterjson();

    function gettwitterjson() {
      var loading = $('.ku-loading');
      var wrapper = $("#twitter-feed");
      var displaylimit = wrapper.attr("data-tweets");
      var user = wrapper.attr("data-account");
      var twitterAccount = (typeof user === 'undefined') ? 'koebenhavns_uni' : user.trim();
      var url = "https://cms.secure.ku.dk/instacms/twitter/twitterByAccount.php";
      $.support.cors = true;
      $.ajax({
        url: url,
        type: 'GET',
        dataType: "json",
        crossDomain: true,
        data: {
          user: twitterAccount
        },
        success: function (feeds) {
          //console.log(feeds);
          wrapper.find(loading).addClass('hidden');
          $(feeds).each(function (i, e) {
            var tweetscreenname = e.user.name;
            var tweetusername = e.user.screen_name;
            var profileimage = e.user.profile_image_url_https;
            var time = e.created_at.replace("+0000 ", "") + " UTC";
            var d = new Date(time);
            var status = e.full_text;
            status = renderLinks(status);
            var aria = (e.full_text) ? e.full_text.substring(0, 80) + '...' : '';

            var tweetid = e.id_str;
            var photoUrl = '';
            var twitterActions = '';
            var showTweetActions = true;

            if (typeof e.extended_entities != 'undefined') {
              $.each(e.extended_entities.media, function (j, v) {
                var photo = v.media_url_https;
                photoUrl = '<img src="' + photo + '" alt="Billede af ' + tweetscreenname + '" class="img-responsive">';
              })
            }

            if (showTweetActions == true) {
              twitterActions = '<div class="tw-actions clearfix"><div class="intent tw-reply"><a aria-label="' + aria + '" target="_blank" rel="noopener" href="https://twitter.com/intent/tweet?in_reply_to=' + tweetid + '" title="Svar">Svar</a></div><div class="intent tw-rt"><a aria-label="' + aria + '" target="_blank" rel="noopener" href="https://twitter.com/intent/retweet?tweet_id=' + tweetid + '" title="Retweet">Retweet</a></div><div class="intent tw-fav"><a aria-label="' + aria + '" target="_blank" rel="noopener" href="https://twitter.com/intent/like?tweet_id=' + tweetid + '" title="Like">Like</a></div></div>';
            }

            wrapper.find('ul').append('<li><div class="imgInfo"><a target="_blank" rel="noopener" tabindex="-1" href="https://twitter.com/' + tweetusername + '" ><img src="' + profileimage +
              '" class="profileImg" alt="@' + tweetusername + '" title="@' + tweetusername + '" /></a></div><div class="twitterInfo"><div class="fullName">' + tweetscreenname + '</div><div class="twitterName">@' +
              tweetusername + '</div></div><div class="description">' + status + '</div>' + photoUrl + '<div class="tweet-time"><a target="_blank" rel="noopener" tabindex="-1" href="https://twitter.com/' + tweetusername + '/status/' + tweetid +
              '" title="Se tweet fra @' + tweetusername + '">' + timeSince(d) + '</a></div>' + twitterActions + '</li>');

            return i < displaylimit - 1;
          });
        },
        error: function (xhr, status, error) {
          console.log(xhr.responseText);
        }
      });
    }

    function renderLinks(data) {
      //Add href to all links within tweets
      data = data.replace(/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g, function (url) {
        return '<a target="_blank" rel="noopener" href="' + url + '">' + url + '</a>';
      });

      //Add link to @usernames used within tweets
      data = data.replace(/\B@([_a-z0-9]+)/ig, function (reply) {
        return '<a target="_blank" rel="noopener" href="https://twitter.com/' + reply.substring(1) + '">' + reply.charAt(0) + reply.substring(1) + '</a>';
      });

      //Add link to hashtags
      data = data.replace(/(?:^|\s)#(\w+)/ig, function (hashtag) {
        return '<a target="_blank" rel="noopener" href="https://twitter.com/hashtag/' + hashtag.trim().toLowerCase().replace(/#/g, '') + '">' + hashtag + '</a>';
      });

      return data;
    }

    function timeSince(timeStamp) {
      // relative time
      var lang = window.navigator.userLanguage || window.navigator.language;
      var now = new Date(),
        secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
      if (secondsPast < 60) {
        return parseInt(secondsPast, 10) + 's';
      }
      if (secondsPast < 3600) {
        return parseInt(secondsPast / 60, 10) + 'm';
      }
      if (secondsPast <= 86400) {
        return parseInt(secondsPast / 3600, 10) + 't';
      }
      if (secondsPast > 86400) {
        var day = timeStamp.getDate();
        var month = timeStamp.toLocaleString(lang, { month: 'long' });
        var year = timeStamp.getFullYear() == now.getFullYear() ? "" : " " + timeStamp.getFullYear();
        return day + '. ' + month + ' ' + year;
      }
    }

  });

})(jQuery);
