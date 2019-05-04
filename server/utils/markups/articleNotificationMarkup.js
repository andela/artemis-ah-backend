import template from './emailTemplate';

export default (authorName, title, description, url) => template(`<div>
  <div style="color:#777;">${authorName} published a new article</div>
  <div style="font-weight:bold;font-size:19px;margin-top:5px;padding-top:10px;border-top:1px solid #dfdfdf;">${title}</div>
  <div style="margin-top:5px;">${description}</div>
  <div style="margin-top:15px;"><a href="https://authorshaven-client.herokuapp.com/article${url}" class="link-btn">Read More &rarr;</a></div>
</div>`);
