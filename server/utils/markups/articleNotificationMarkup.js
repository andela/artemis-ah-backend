import template from './emailTemplate';

export default (authorName, title, description, url) => template(`<div>
  <div style="color:#444;">${authorName} published a new article</div>
  <div style="font-weight:bold;font-size:19px;margin-top:10px;border-top:1px solid #dfdfdf;">${title}</div>
  <div style="margin-top:10px;">${description}</div>
  <div style="margin-top:10px;"><a href="${url}" class="link-btn">Read More &rarr;</a></div>
</div>`);
