<form class="form mfa-settings">
<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header"> User email rule </div>
	<div class="col-sm-10 col-xs-12">
		<label> Email block </label>
		<textarea class="form-control" placeholder="" id="email-blacklist" name="email-blacklist"></textarea>
		<p class="help-block">
		用户邮箱黑名单, 正则表达式, 一行一条
		</p>
	</div>
</div>

<div class="row">
	<div class="col-sm-2 col-xs-12 settings-header"> Username rule </div>
	<div class="col-sm-10 col-xs-12">
		<label> Username block </label>
		<textarea class="form-control" placeholder="" id="username-blacklist" name="username-blacklist"></textarea>
		<p class="help-block">
		用户名黑名单, 正则表达式, 一行一条
		</p>
	</div>
</div>
</form>

<button id="save" class="floating-button mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored">
	<i class="material-icons">save</i>
</button>