define([
	'core',
	'index/templates',
    'debug/views/DebugWorkspaceView'
], function (LM, templates,DebugWindow) {

	return LM.View.extend({
		className: 'workspace index-workspace',

		template: templates['index/IndexWorkspace'],

		events: {
            'click #btnDebug': '_openDebugDialog'
		},

		appEvents: {
		},

		initialize: function (options) {
			this.module = options.module;
		},
        _openDebugDialog: function (e) {
            var width = $(window).width();
            var _HELPMSG =
                "You can type a built-in commands or an external command\n\n" +
                    "Built-in commands:\n" +
                    "  clear - clear the output window\n" +
                    "  help <cmd> - show help information\n" +
                    "  !account - display account information used by sbwinproxy\n" +
                    "  !adetail <taskid> - show detail info of an AutoDiscovery task\n" +
                    "  !adlist - list AutoDiscovery tasks\n" +
                    "  !agentstatus <agentid> - show agent status and stats\n" +
                    "  !apdetail <taskid> - show detail info of an AutoProps task\n" +
                    "  !aplist [type=ap|get] [h=xxx] [pid=nnn] [method=foo] - list AutoProps tasks\n" +
                    "  !cim [username=foo [password=bar]] [namespace=CIMV2] h=host [port=5989] [ssl=true|false] c=class [query] - execute a CIM query\n" +
                    "  !dir [<native options>] <folder> - list files under folder\n" +
                    "  !dumpheap [live=true|false] - dump collector jvm heap info, live=true mean only dump the live object\n" +
                    "  !esx [username=foo password=bar] <host> <entityName> <entityType[host|vm|datastore|cluster|resourcepool|hoststatus|cpu|memory|disk|network]> [counter1 [counter2...]]\n" +
                    "  !esxlsentity h=<vcenter_or_esxhost> [u=user p=pass] type=vm|datastore|host [pattern]\n" +
                    "  !esxlscounter h=<esxhost or vcenter> [u=username p=password] [type=vm|host|datastore name=entityName]\n" +
                    "  !firewallstatus - show firewall settings\n" +
                    "  !get filename - copy a file from agent to the server $company/scripts\n" +
                    "  !getconfig configKey - get collector configuration item value\n" +
                    "  !groovy scriptPath - executing groovy script. scriptPath is an absolute path or a path relative <agentRoot>/bin\n" +
                    "  !history - show command history\n" +
                    "  !http [username=foo password=bar] url - send a HTTP request and returns the response\n" +
                    "  !ipaddress - show the agent ip\n" +
                    "  !ipmi [username=foo [password=bar]] [command=sensor|sel] [arg=<id for sensor>] h=host - execute a IPMI command\n" +
                    "  !java [-cp=test.class] [-jar test.jar] <arguments> \n" +
                    "  !jdbc url=foo [username=foo [password=bar]] query\n" +
                    "  !jmx h=host [func=path] [port=9003] [u=xxxx] [p=yyy] [proto=rmi|mp] [timeout=seconds] \"jmxPath1\" [\"jmxPath2\" ... \"jmxPathN\"] - retrieve JMX variable values.\n" +
                    "  !loglevel component=foo level=trace|debug|info|warn|error|critical - change the log level of an agent component\n" +
                    "  !logsurf level=all|trace|debug|info|warn|error|critical seq=xxx taskId=xxx <filename> [<n>] - surf the log file\n" +
                    "  !mongo usage: !mongo [h=xxx [port=xxxx] ] [user=xxx [pass=yyy] ] [db=test [coll=ccc] ] [query]\n" +
                    "  !netapp [username=xxx password=xxx] [ssl=true|false] [port=nnn] <host> <command> [args]\n" +
                    "  !nslookup hostname - resolve IP of the given host\n" +
                    "  !nspdetail [verbose=false|true] <taskid> - show detail info of a netscanning task\n" +
                    "  !nsplist - show all net scanning tasks\n" +
                    "  !netflow func=listDevices|query|diagnose|dump|debug <sql> - get netflow information\n" +
                    "  !perfinfo [username=foo password=bar] <host> counter [counter ...]\n" +
                    "  !perfmon [username=foo password=bar object=obj timeout=5000] host counter [counter ...]\n" +
                    "  !ping <host> - ping a host\n"      +
                    "  !put [overwrite=true|false] filename - copy a file under server $company/scripts to $agentroot/tmp\n" +
                    "  !register - request the collector to register itself\n" +
                    "  !reload - force reloading agent configuration from server\n" +
                    "  !replace [overwrite=true|false] <source> <dest> -copy $installdir/tmp/<source> to $installdir/<dest>\n" +
                    "  !restart [collector|watchdog]- restart collector (e.g. to re-load changed configurations) or watchdog\n" +
                    "  !setconfig [persist=false] configKey configValue - set collector configuration item\n" +
                    "  !snetflow func=diagnose|checkTables [<deviceId>] - debug netflow device info in server side\n" +
                    "  !snmpget [community=foo] [version=v1|v2|v3] host oid [oid ...] ( use 'help !snmpget' command for more information)\n" +
                    "  !snmpwalk [community=foo] [version=v1|v2|v3] host oid  (use 'help !snmpwalk' command for more information)\n" +
                    "  !svcdetail [checkpoint=all|..] [svc-id] - list detailed information of service scheduled.\n" +
                    "  !svclist [type=xxx] [name=xxxx] - list services for current company\n" +
                    "  !svc [agent|watchdog] [status|start|stop] - get the agent/watchdog status or start/stop the agent/watchdog\n" +
                    "  !service func=debug serviceName=foo groupName=foo - do service action with named service and SM group\n" +
                    "  !tail <filename> [<n> [<regex>]]\n" +
                    "  !taskkill [<native options>] <processId> - kill specified process on agent's hosting machine\n" +
                    "  !tasklist [<native options>] - list process on agent's hosting machine\n" +
                    "  !tdetail <taskid> - list detail of a task, taskid refer the output of !tlist command\n" +
                    "  !tlist [h=xxx] [dsi=xxx] [es=xxx] [c=xxx] - list a set of collecting tasks include datasource and eventsource\n" +
                    "  !upgradeproxy\n" +
                    "  !upgradestatus\n" +
                    "  !uploadlog <logfile>\n" +
                    "  !uptime - shows the agent uptime\n" +
                    "  !vbscript scriptPath - executing VBscript script. scriptPath is an absolute path or a path relative <agentRoot>/bin\n" +
                    "  !winevent [username=foo password=bar] [h=xxx] [es=xxx] [filter=true|false] - collect Windows event log\n" +
                    "  !wmi [username=foo [password=bar]] h=host query - execute a WMI query\n" +
                    "  !wmimethod [username=foo [password=bar]] h=host method=XXX path=XXX [params=\"XXX\"] - call a WMI method\n" +
                    "  !xen [username=foo password=bar] <host> <entityName> <entityType[host|cpu|pif|vm|vbd|vif|sr|pool]> [counter1 [counter2...]]\n" +
                    "  !checkServerConnectivity <host>\n";
            this.registerComponent('debug', new DebugWindow({
                width: 1000,
                height:"auto",
                title: 'Debug Window',
                data: {
                    msg: _HELPMSG
                }
            }));
        },

		render: function () {
			var module = this.module;
			var loginUser = LM.getLoginUser();

			this.$el.html(this.template({
				userName: loginUser.username
			}));
		}
	});
});
