<!-- IMPORT admin/partials/settings/header.tpl -->

<div class="row">
    <div class="col-sm-2 col-xs-12 settings-header"> User email rule </div>
    <div class="col-sm-10 col-xs-12">
        <form>
            <label> Email block </label>
            <textarea class="form-control" placeholder="" data-field="mirai-forum:email-blacklist"></textarea>
            <p class="help-block">
            用户邮箱黑名单, 正则表达式, 一行一条
            </p>
        </form>
    </div>
</div>

<div class="row">
    <div class="col-sm-2 col-xs-12 settings-header"> Username rule </div>
    <div class="col-sm-10 col-xs-12">
        <form>
            <label> Username block </label>
            <textarea class="form-control" placeholder="" data-field="mirai-forum:username-blacklist"></textarea>
            <p class="help-block">
            用户名黑名单, 正则表达式, 一行一条
            </p>
        </form>
    </div>
</div>


<!-- IMPORT admin/partials/settings/footer.tpl -->
