counter = 0;
state_interval_id = 0;
channels = {};

document.addEventListener("DOMContentLoaded", function(){
    //ajax csrf 토큰 생성
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    LoadAll();
    state_interval_id = setInterval(GetSiteState, 1000);
});


function LoadAll()
{
    channels = JSON.parse(document.getElementById('infos').textContent)
    for(var key in channels)
    {
        Load(channels[key])
    }
}

function Load(channel, replace_item)
{
    var item = document.getElementById("item-prototype").cloneNode(true);
    item.setAttribute("id","item"+counter);

    var cname = item.querySelector("#cname")
    cname.setAttribute("id","cname"+counter);
    cname.value = channel.cname;
    cname.setAttribute("readonly",true);

    var oauth = item.querySelector("#oauth");
    oauth.setAttribute("id","oauth"+counter);
    oauth.value = channel.oauth;

    var apply = item.querySelector("#apply");
    apply.setAttribute("id","apply"+counter);
    apply.value = counter;
    apply.addEventListener("click", Apply);
    item.querySelector("#loading").setAttribute("id","loading"+counter);

    var downlist = item.querySelector("#downlist");
    downlist.setAttribute("id","downlist"+counter);
    //여기 complete로 바꾸기
    AddDownlist(downlist,channel['incomplete'],channel['complete'],channel['metadata']);
    var info = item.querySelector("#info");
    info.innerHTML = "Latest Download Time : <span style='font-weight: bold;color: #00c;'>" + channel['last-download'] +"</span>"
        + "  State : <span style='font-weight: bold;color: " + (channel['running']?"#c00;'>Downloading...":"#0d0;'> Idle") + "</.span>";

    var show = item.querySelector("#show");
    show.value = counter;
    show.setAttribute("id","show"+counter);
    show.style.height = "44px";
    show.addEventListener("click", Show);

    var del = item.querySelector('#delete');
    del.value =counter;
    del.setAttribute("id","delete"+counter);
    del.style.height = "44px";
    del.addEventListener("click", Delete);

    var sync_toggle = item.querySelector("#sync-toggle");
    sync_toggle.value = counter;
    sync_toggle.style.display = "inline-block";
    sync_toggle.setAttribute("id","sync_toggle"+counter);
    sync_toggle.addEventListener("click", SyncToggle);
    if(channel.running == true){
        sync_toggle.innerText = "ON";
        sync_toggle.classList.remove('toggle-down');
        sync_toggle.classList.add('toggle-up');
    }
    if(replace_item == undefined)
        document.getElementById("list").appendChild(item);
    else{
        document.getElementById("list").insertBefore(item, replace_item);
        replace_item.remove();
    }
    counter++;
}


function Add()
{
    var item = document.getElementById("item-prototype").cloneNode(true);
    item.setAttribute("id","item"+counter);
    item.querySelector("#cname").setAttribute("id","cname"+counter);
    item.querySelector("#oauth").setAttribute("id","oauth"+counter);
    item.querySelector("#loading").setAttribute("id","loading"+counter);
    var apply = item.querySelector("#apply");
    apply.setAttribute("id","apply"+counter);
    apply.value = counter;
    apply.addEventListener("click", Apply);
    var show = item.querySelector("#show");
    show.setAttribute("id","show"+counter);
    show.addEventListener("click", Show);
    var del = item.querySelector("#delete");
    del.value = counter;
    del.addEventListener("click", function(event){ 
        var n = event.target.value;
        var item = document.getElementById("item"+n);
        item.remove();
    });
    document.getElementById("list").appendChild(item);
    counter++;
}


function AddDownlist(downlist,incomplete,complete,metadata)
{
    var title_space = downlist.querySelector("#downlist-title");
    var title = document.createElement('h2');
    title.classList.add("downlist-title");
    title.innerText="Download Queue";
    title_space.appendChild(title);
    var line = document.createElement('hr');
    line.style.marginRight = "20px";
    title_space.appendChild(line);

    for(var id in incomplete)
    {
        var key = incomplete[id];
        var listitem = document.getElementById("downlist-item").cloneNode(true);
        listitem.setAttribute("id","downlist-item"+key);
        listitem.style.display = 'block';
        var thumbnail = listitem.querySelector("#thumbnail");
        thumbnail.setAttribute('src',metadata[key]['thumbnailURLs'][0]);
        thumbnail.setAttribute('width','150');
        var content = listitem.querySelector("#listitem-content");

        var sec = (metadata[key].lengthSeconds % 60);
        var min = Math.floor(metadata[key].lengthSeconds / 3600) % 60;
        var hour = Math.floor(metadata[key].lengthSeconds / 3600);
        content.innerHTML = "<span style='font-weight:bold;'>Title: </span> " + metadata[key].title + " [" + key +"]" +"<br>" 
                            + "<span style='font-weight:bold;'>Created: </span>" + metadata[key].createdAt + "<br>" 
                            + "<span style='font-weight:bold;'>Streamer:</span> " + metadata[key].owner.displayName + "<br>"
                            + "<span style='font-weight:bold;'>Length:</span> " + hour+":"+min+":"+sec;
        var loading = listitem.querySelector("#progress");
        loading.setAttribute("id","progress"+key)
        loading.style.display = "block";
        downlist.appendChild(listitem);
    }

    title_space = downlist.querySelector("#downlist-title").cloneNode(true);
    title = title_space.getElementsByTagName("h2")[0];
    title.innerText="Videos Downloaded";
    downlist.appendChild(title_space);

    for(var id in complete)
    {
        var key = complete[id];
        var listitem = document.getElementById("downlist-item").cloneNode(true);
        listitem.setAttribute("id","downlist-item"+key);
        listitem.style.display = 'block';
        var thumbnail = listitem.querySelector("#thumbnail");
        thumbnail.setAttribute('src',metadata[key]['thumbnailURLs'][0]);
        thumbnail.setAttribute('width','150');
        var content = listitem.querySelector("#listitem-content");

        var loading = listitem.getElementsByTagName("img")[1];
        loading.style.display = 'block';

        var sec = (metadata[key].lengthSeconds % 60);
        var min = Math.floor(metadata[key].lengthSeconds / 3600) % 60;
        var hour = Math.floor(metadata[key].lengthSeconds / 3600);
        content.innerHTML = "<span style='font-weight:bold;'>Title: </span> " + metadata[key].title + " [" + key +"]" +"<br>" 
                            + "<span style='font-weight:bold;'>Created: </span>" + metadata[key].createdAt + "<br>" 
                            + "<span style='font-weight:bold;'>Streamer:</span> " + metadata[key].owner.displayName + "<br>"
                            + "<span style='font-weight:bold;'>Length:</span> " + hour+":"+min+":"+sec;
        downlist.appendChild(listitem);
    }
}


function Apply(event){
    var n = event.target.value;
    event.target.setAttribute("disabled", true);
    var cname = document.getElementById("cname"+n);
    var oauth = document.getElementById("oauth"+n);
    if(cname.value == ""){
        alert("Channel Name is empty");
        return;
    }
    var loading = document.getElementById("loading"+n);
    loading.style.display = "inline-block";
    if(cname.getAttribute('readonly') == null)
    {
        //channel name validation
        $.ajax({
            url: "validate_channel",
            data : {"channel_name" : cname.value, "i" : n},
            method: "POST",
            dataType: "json",
            async : true,
            success : function(data){
                if(data.valid == true)
                {
                    //channel register
                    $.ajax({
                        url: "register",
                        data: {"channel_name" : cname.value, "oauth" : oauth.value, "i": data.i},
                        method: "POST",
                        dataType: "json",
                        async : true,
                        success : function(data){
                            document.getElementById("loading"+data.i).style.display = "none";  
                            if(data.valid == false)
                            {
                                alert("channel name already exists");
                            }
                            else
                            {
                                document.getElementById("cname"+data.i).setAttribute("readonly",true);
                                Load(data.channel,document.getElementById("item"+data.i));
                            }
                        },
                        error: function (request, status, error){
                            console.log('request ' + request);
                            console.log('status ' + status);
                            console.log('error ' + error);
                        }
                    });
                }
                else
                {
                    alert("wrong channel name");
                    document.getElementById("loading"+data.i).style.display = "none";
                    document.getElementById("apply"+data.i).removeAttribute("disabled");
                }
            },
            error: function (request, status, error){
                console.log('request ' + request);
                console.log('status ' + status);
                console.log('error ' + error);
            }
        });
    }
    else
    {
        if(oauth.value == channels[cname.value].oauth){
            event.target.removeAttribute("disabled", true);
            loading.style.display = "none";
            return;
        }
        $.ajax({
            url: "change_oauth",
            data : {"channel_name" : cname.value, "oauth" : oauth.value, "i": n},
            method: "POST",
            dataType: "json",
            async : true,
            success : function(data){
                GetChannel(data.cname).oauth = data.oauth;
                document.getElementById("apply"+data.i).removeAttribute("disabled");
                document.getElementById("loading"+data.i).style.display = "none";   
                if(data.valid == true){
                    alert('change success');
                }
                else{
                    alert('change fail')
                }
            },
            error: function (request, status, error){
                console.log('request ' + request);
                console.log('status ' + status);
                console.log('error ' + error);
            }
        });
    }
}

function SyncToggle(event){
    var n = event.target.value;
    var cname = document.getElementById("cname"+n);
    if(event.target.innerText == "OFF")
    {
        event.target.innerText = "ON";
        event.target.classList.remove('toggle-down');
        event.target.classList.add('toggle-up');
    }
    else// if(event.target.innerText == "ON")
    {
        event.target.innerText = "OFF";
        event.target.classList.remove('toggle-up');
        event.target.classList.add('toggle-down');
    }
    $.ajax({
        url: "download_channel",
        data : {"channel_name" : cname.value, "toggle": event.target.innerText == "ON"},
        method: "POST",
        dataType: "json",
        async : true
    });
}

function Show(event){
    var n = event.target.value;
    if(event.target.innerText == "▼")
    {
        event.target.innerText = "▲"
        document.getElementById("downlist"+n).style.display = "block";
    }
    else
    {
        event.target.innerText = "▼"
        document.getElementById("downlist"+n).style.display = "none";
    }
}

function Delete(event){
    if(!window.confirm('Really delete?'))
        return;
    var n = event.target.value;
    var item = document.getElementById("item"+n);
    var cname = item.querySelector('#cname'+n);
    item.remove();
    $.ajax({
            url: "delete_channel",
            data : {"channel_name" : cname.value},
            method: "POST",
            dataType: "json",
            async : true,
    });
}

function GetSiteState(){
    $.ajax({
        url: "download_state",
        data : {"channel_names" : Object.keys(channels)},
        method: "POST",
        dataType: "json",
        async : true,
        success : function(data){
            for(key in data.states)
            {
                working = data.states[key];
                if(Object.keys(working).length > 0){
                    var progress = document.getElementById('progress'+ working.vcode);
                    progress.innerText = working.progress;
                    var loading = progress.previousElementSibling;
                    loading.style.display = "block";
                    if(progress.value == undefined) 
                        progress.value = working.vcode;
                    if(working.progress == "100%" || working.vcode != progress.value){
                        var listitem = document.getElementById('downlist-item' + working.vcode);
                        progress.appendChild(listitem);
                        loading.style.display = "none";
                        progress.style.display = "none";
                        progress.nextElementSibling.style.display = "block"               
                    }
                    progress.value = working.vcode;
                }
            }
        }
    });
}