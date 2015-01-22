define([
    'core',
    'jquery',
    'debug/templates',
    'modelurls',
    'lmmsgbox',
    'lmblockui',
    'lmformdialog'
], function (LM, $, templates,modelUrls,MessageBox,BlockUI, Dialog) {
    return Dialog.extend({
        template: templates['debug/DebugWorkspace'],
        events: {
            'keydown input': '_submit',
            'keyup input': '_getUPHistory',
            'keyup input': '_getDownHistory'
        },
        initialize: function (options) {
            this._super(options);
            this._cmdEl="";
            this.blockUI = new BlockUI();
            this._history =[];
            this._idx = 0;
            this._HELPMSG =
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
            this. _CMDHELPMSG = {
                '!ACCOUNT': '!account: display account information used by agent (and sbwinproxy). No arguments required.\n',
                '!ADETAIL': '!adetail: show detail info of a getDiscoveryFeed task or discovery task\n' +
                    'usage: !adetail <taskid>\n' +
                    'example: !adetail 43434334\n',
                '!ADLIST': '!adlist: list getDiscoveryFeed tasks or discovery tasks\n' +
                    'usage: !adlist [type=get|ad] [h=xxx] [ds=xxx] [pid=xxx] [method=foo]\n' +
                    'example: !adlist type=get\n' +
                    'example: !adlist type=ad h=paz* ds=WinLogicDisk-\n' +
                    'example: !adlist method=ad_snmp\n',
                '!AGENTSTATUS': '!agentstaus: check agent stats\n' +
                    'usage: !agentstatus <agentid>',
                '!APDETAIL': '!apdetail: show detail information of an auto props task.\n' +
                    'usage: !apdetail <taskid>\n' +
                    'example: !qpdetail 12345467890\n',
                '!APLIST': '!aplist list autoprops tasks\n' +
                    'usage: !aplist [type=ap|get] [h=xxx] [pid=nnn] [method=foo]\n' +
                    'example: !aplist type=get\n' +
                    'example: !aplist type=ap h=paz*-\n',
                '!CIM': '!cim: execute a cim query against the given host and print the result\n' +
                    'usage: !cim [username=foo password=bar] [namespace=CIMV2] h=<host> [port=5989] [ssl=false] c=<class> [cim query]\n' +
                    "If you don't give the username/password, the agent will use cim.user/cim.pass\n" +
                    "properties of the host.\n" +
                    "example: !cim namespace=emc/celerra h=paz02sql002 p=5989 ssl=true c=CIM_ComputerSystem select * from CIM_ComputerSystem",
                '!DIR': '!dir: display files in a folder\n' +
                    'usage: !dir [<native options>] <folder>\n' +
                    'example1:   !dir                 -- display files in current folder\n' +
                    'example2:   !dir -l /tmp         -- list linux files in /tmp folder\n' +
                    'example3:   !dir /N /OS D:\\      -- list windows files in D:\\ and sort them by size\n',
                '!DUMPHEAP': '!dumpheap: dump collector jvm heap\n' +
                    'usage: !dumpheap [live=true|false]',
                '!ESX': '!esx: query a list of esx performance counter against the given host and print the result\n' +
                    'usage: !esx [username=foo password=bar] <host> <entityName> <entityType[host|vm|datastore|cluster|resourcepool|hoststatus|cpu|memory|disk|network]> [counter1 [counter2...]]\n' +
                    "If you don't give the username/password, the agent will use esx.user/esx.pass\n" +
                    "properties of the host.\n" +
                    "example: !esx vc-server esx-name host cpu.usage.average mem.consumed.average",

                '!ESXLSENTITY': '!esxlsentity: list entities in a vcenter server or esx host\n' +
                    "usage: !esxlsentity h=<esxhost or vcenter> [u=username p=password] type=vm|host|datastore [pattern]\n" +
                    "\n" +
                    "example:\n" +
                    "\n" +
                    "   List all VMs\n" +
                    "     !esxlsentity h=myvcenter.logicmonitor.net type=vm\n" +
                    "\n" +
                    "   List all VMs running Linux guest OS\n" +
                    "     !esxlsentity h=myesxhost1.logicmontor.net type=vm *linux*\n" +
                    "\n" +
                    "   List all VMs whose name contains text 'financial'\n" +
                    "     !esxlsentity h=myesxhost1.logicmonitor.net type=vm *financial*\n" +
                    "\n" +
                    "   List all datastores\n" +
                    "     !esxlsentity h=vcenter.logicmonitor.net type=datastore\n" +
                    "\n" +
                    "   List all datastores supported by host1\n" +
                    "     !esxlsentity h=vcenter.logicmonitor.net type=datastore host1",

                "!ESXLSCOUNTER": '!esxlscounter: list all counters supported by an esx host or a vcenter server\n' +
                    '               list all metrics supported by an entity\n' +
                    "usage: !esxlscounter h=<esxhost or vcenter> [u=username p=password] [type=vm|host|datastore name=entityName]\n" +
                    "\n" +
                    "example:\n" +
                    "\n" +
                    "  List counters supported by a vcenter or host\n" +
                    "    !esxlsentity h=myvcenter.logicmonitor.net\n" +
                    "\n" +
                    "  List metrics supported by a VirtualMachine\n" +
                    "    !esxlscounter h=myesxhost1.logicmontor.net type=vm name=mysqlvm\n" +
                    "\n" +
                    "  List all metrics whose names start with 'cpu' supported by vm mysqlvm\n" +
                    "    !esxlscounter h=myesxhost1.logicmonitor.net type=vm name=mysqlvm cpu*\n",

                "!ESXQUERYCOUNTER": '!esxquerycounter: query real-time value of a list counters\n' +
                    "Usage: !esxquerycounter h=<venter_or_esxhost> [u=user p=pass] type=vm|datastore|host name=<entityName> counter1 ...\n" +
                    "\n" +
                    "Examples:\n" +
                    "\n" +
                    "  Query value of counter virtualDisk.numberReadAveraged.average on instance scsi0:0 for vm mysqlvm\n" +
                    "    !esxquerycounter h=myesx.logicmonitor.net type=vm name=mysqlvm virtualDisk.numberReadAveraged.average.scsi0:0\n" +
                    "\n" +
                    "  Query value of all counters starting with 'cpu' on VM mysqlvm\n" +
                    "    !esxquerycounter h=myesx.logicmonitor.net type=vm name=mysqlvm cpu*\n",

                '!FIREWALLSTATUS': '!firewallstatus: show firewall settings\n' +
                    "usage: !firewallstatus\n" +
                    "example: !firewallstatus\n",

                '!GET': "!get: copy a file from agent to <company>/script\n" +
                    "usage: !get <filename>\n" +
                    "the current working directory of the agent is <agentroot>/bin\n" +
                    "example: !get ../lib/agent.jar\n" +
                    "this example copies <agentroot>/lib/agent.jar to <company>/script",
                '!GETCONFIG': "!getconfig configKey - get collector configuration value for configKey\n" +
                    "usage: !getconfig configKey\n" +
                    "example: !getconfig pingpool.usejava - return current configuration value for pingpool.usejava",
                '!GROOVY': "!groovy: executing specified groovy script\n" +
                    "usage: !groovy <scriptPath>\n" +
                    "scriptPath is an absolute path or a path relative <agentRoot>/bin.\n" +
                    "example: !groovy ../lib/test.groovy\n" +
                    "this example will executing $agentroot/lib/test.groovy",
                '!HISTORY': "!history: show a list of history commands.\n",
                '!HTTP': "!http: send a HTTP request to a host and print the response\n" +
                    "usage: !http [username=foo password=bar] <url>\n" +
                    "example: !http http://www.google.com/index.html",
                '!IPADDRESS': '!ipaddress: display ip configuration which agent installed. No arguments required.\n',
                '!IPMI': '!ipmi: execute a ipmi command against the given host and print the result\n' +
                    'usage: !ipmi [username=foo password=bar] [command=sensor|sel] [arg=id] h=<host>\n' +
                    "If you don't give the username/password, the agent will use ipmi.user/ipmi.pass\n" +
                    "properties of the host.\n" +
                    "example1: !ipmi command=sensor h=console.host2.sb.logicmonitor.net        - list sensors on the host\n" +
                    "example2: !ipmi command=sensor arg=2 h=console.host2.sb.logicmonitor.net  - list sensor with id=2 on the host\n" +
                    "example3: !ipmi command=sel h=console.host2.sb.logicmonitor.net           - list IPMI events on the host\n",
                '!JAVA': "!java: execute *.class or *.jar file\n" +
                    "example1: !java -cp ../lib/agent.jar com.santaba.agent.AgentVersion - print agent version \n" +
                    "example2: !java -jar ../lib/executable.jar arg1 arg2 - execute an executable jar with given arguments\n" ,
                '!JDBC': "!jdbc: execute a sql query against the given host\n" +
                    "usage: !jdbc url=<url> [username=foo [password=bar]] <query>\n" +
                    "example: !jdbc url=jdbc:mysql://paz02mysql001:1506/finance username=foo passowrd=bar select * from table1",
                '!JMX': '!jmx: query JMX variables\n' +
                    'usage: !jmx h=host [func=path] [port=9003] [u=xxxx] [p=yyy] [timeout=seconds] [proto=rmi|mp] jmxPath1 [jmxPath2 ... jmxPathN]\n' +
                    'example: !jmx h=prod* "java.lang:type=Threading:ThreadCount java.lang.Memory:HeapMemoryUsage.used"\n' +
                    '         !jmx h=192.168.1.1 proto=mp "java.lang:type=Threading:ThreadCount java.lang.Memory:HeapMemoryUsage"\n',
                '!LOGLEVEL' : '!loglevel: change the log level of an agent component\n' +
                    'usage: !loglevel component=<modulename> level=trace|debug|info|warn|error|critical\n' +
                    'example: !loglevel component=collector.esx level=trace',

                '!LOGSURF' : '!logsurf: surf the log file\n' +
                    'usage: !logsurf level=all|trace|debug|info|warn|error|critical seq=xxx taskId=xxx <filename> [<n>] - surf the log file\n' +
                    'example: !logsurf level=trace ..\\wrapper.log 30',
                '!MONGO': '!mongo: execute a database command or collection query against the given host\n' +
                    'usage: !mongo [h=xxx [port=xxxx] ] [user=xxx [pass=yyy] ] [db=test [coll=ccc] ] [query]\n' +
                    'example: !mongo h=124.111.5.132 username=foo passowrd=bar dbname=test {serverStatus:1}',
                '!NETAPP': "!netapp: use netapp sdk to query netapp server\n" +
                    "usage: !netapp [username=foo password=bar] [ssl=false|true] [port=nnn] <host> <command> <args>\n" +
                    "If the user doesn't specify username/password, netapp.user and netapp.pass properties of that host\n" +
                    "will be used.\n" +
                    "the command could be\n" +
                    "    perf-object-list-info\n" +
                    "    perf-object-instance-list-info <object>\n" +
                    "    perf-object-get-instances <object_type> <instancename>\n" +
                    "example: !netapp paznetapp001 perf-object-list-info",
                '!NETFLOW': '!netflow: get netflow information in collector.\n' +
                    'usage: !netflow func=listDevices \n' +
                    '  !netflow func=query select * from raw<deviceId>\n' +
                    '  !netflow func=diagnose <deviceId> [timezone]\n' +
                    '  !netflow func=dump <deviceId>\n' +
                    '  !netflow func=debug log no|all|error\n' +
                    'example: !netflow func=query select * from raw1',
                '!NSLOOKUP': "!nslookup: resolve the IP of the given host\n" +
                    "usage: !nslookup <host>\n" +
                    "example: !nslookup www.google.com",
                '!NSPDETAIL': '!nspdetail: list detailed information of given netscanning task.\n' +
                    'usage: !nspdetail [verbose=false|true] <taskid>\n' +
                    'example1: !nspdetail 1342342134\n' +
                    'example2: !nspdetail verbose=true 1342342134\n',
                '!NSPLIST': '!nsplist: list all netscanning taks\n' + 'usage: !nsplist\n',
                '!PERFINFO': '!perfinfo: query a list of performance counters info against the given host\n' +
                    'usage: !perfinfo [username=foo password=bar] <host> <counter1> <counter2> ...\n' +
                    "if you don't specify username/password, the agent will use wmi.user/wmi.pass properties\n" +
                    "of that host.\n" +
                    'example: !perfinfo paz02sql003 "Processor(_Total)\\% Processor Time"',
                '!PERFMON': '!perfmon: query a list of performance monitor counters against the given host\n' +
                    'usage: !perfmon [username=foo password=bar object=obj timeout=5000] <host> <counter1> \n' +
                    '<counter2> ...\n' +
                    "if you don't specify username/password, the agent will use wmi.user/wmi.pass properties\n" +
                    'of that host. the unit of timeout is millisecond. the default value of timeout is 5000ms\n' +
                    'example: !perfmon paz02sql003 "System\\System Up Time"\n' +
                    '         !perfmon object="Processor" paz02sql003',
                '!PING': "!ping: ping a given host.\n" +
                    "usage: !ping <host>\n" +
                    "example: !ping www.google.com",
                '!PUT': "!put: copy a file under <company>/script to <agentroot>/tmp\n" +
                    "usage: !put [overwrite=false|true] <file>\n" +
                    "example: !put overwrite=true abc.vbs\n" +
                    "the example above will copy <company>/script/abc.vbs to <agentroot>/tmp. If the file\n" +
                    "already exists, it will be overwrote.",
                '!REGISTER': '!register: ask collector to register itself. If the collector already registered, it can be forced to re-register by setting force=true\n' +
                    "usage: !register [force=false|true]\n" +
                    "example: !register force=true - force the collector to re-register (to change its description)\n",
                '!RELOAD': '!reload: force agent to reload configuration from server.\n',
                '!REPLACE' : "!replace: copy $installdir/tmp/<source> to $installdir/<dest>,\n" +
                    "<source> and <dest> cannot starting with \'..\' or \'/\', <source> should be\n "+
                    "just a filename and <source> should be a ralative path to $installdir like \'lib\' or \'lib/testfolder\' etc\n" +
                    "usage: !replace [overwrite=false|true] <source> <dest>\n" +
                    "example: !replace overwrite=true foo bar - replace bar with foo, if bar already exists, overwrite it\n",
                '!RESTART': '!restart: force restart collector or watchdog. By default the command will be executed by watchdog.\n' +
                    'usage: !restart [collector|watchdog]\n' +
                    'example1: !restart - restart the watchdog and collector.\n' +
                    'example2: !restart collector - restart the collector only.',
                '!SETCONFIG': '!setconfig [persist=false] changes configuration of the collector\n' +
                    'usage: !setconfig configKey configValue\n' +
                    'example1: !setconfig pingpool.usejava true              - change collector to use java pingpool. Once collector restarts, it will use original configuration\n' +
                    'example2: !setconfig persist=true pingpool.jsejava true - change collector to use java pingpool and this change will be saved in agent.conf so collector will use java pingpool even after restarts ',
                '!SNETFLOW': '!snetflow: check netflow logic in server side.\n' +
                    'usage: !snetflow func=diagnose <deviceId> [timezone]\n' +
                    '       !snetflow func=checkTables [action=list|update|delete] [credential=xxx] [awsDynamodbEndpoint] (long time command about 1-3 minutes)\n',
                '!SNMPGET': '!snmpget: get the values of a list of OIDs from the given host\n' +
                    'usage: !snmpget [OPTIONS]  <host> <oid1> <oid2> ...\n' +
                    'OPTIONS:\n'+
                    '  version=VERSION                 specifies SNMP version to use(v1|v2c|v3) \n'+
                    'SNMP Version 1 or 2c specific   \n'+
                    '  community=COMMUNITY           set the community string\n'+
                    'SNMP Version 3 specific \n'+
                    '  auth = PROTOCOL               set authentication protocol (MD5|SHA)\n'+
                    '  authToken = PASSPHRASE        set authentication protocol pass phrase\n'+
                    '  security = USER-NAME          set security name (e.g. bert)\n'+
                    '  priv = PROTOCOL               set privacy protocol (DES|AES|3DES|AES128|AES192|AES256)\n'+
                    '  privToken= PASSPHRASE         set privacy protocol pass phrase\n'+
                    'General communication options \n'+
                    '  timeout = TIMEOUT            set the request timeout (in seconds)\n'+
                    "if you don't specify community and/or version, the agent will use snmp.community and/or\n" +
                    "snmp.version properties of that host\n" +
                    "example1: !snmpget paz02sql003 .1.2.3.4.5.5\n"+
                    "example2: !snmpget version=v3 auth=MD5 authToken=xxxx security=xxxx localhost .1.2.3.4.5.5",
                '!SNMPWALK': '!snmpwalk: walk a tree with the given OID as the root\n' +
                    'usage: !snmpwalk [OPTIONS] <host> <OID>\n' +
                    'OPTIONS:\n'+
                    '  version=VERSION                 specifies SNMP version to use(v1|v2c|v3) \n'+
                    'SNMP Version 1 or 2c specific   \n'+
                    '  community=COMMUNITY          set the community string\n'+
                    'SNMP Version 3 specific: \n'+
                    '  auth = PROTOCOL               set authentication protocol (MD5|SHA)\n'+
                    '  authToken = PASSPHRASE        set authentication protocol pass phrase\n'+
                    '  security = USER-NAME          set security name (e.g. bert)\n'+
                    '  priv = PROTOCOL               set privacy protocol (DES|AES|3DES|AES128|AES192|AES256)\n'+
                    '  privToken= PASSPHRASE         set privacy protocol pass phrase\n'+
                    'General communication options:\n'+
                    '  timeout = TIMEOUT            set the request timeout (in seconds)\n'+
                    "if you don't specify community and/or version, the agent will use snmp.community and/or\n" +
                    "snmp.version properties of that host\n" +
                    "example1: !snmpwalk paz02sql003 .1.2.3.4.5.5\n"+
                    "example2: !snmpwalk version=v3 auth=MD5 authToken=xxxx security=xxxx timeout=4  localhost .1",
                '!SVCDETAIL': '!svcdetail: display detailed information about a service\n' +
                    'usage: !svcdetail svc_id\n',
                '!SVCLIST': '!svclist: list all services\n' +
                    'usage: !svclist [type=all|website|synthetic] [name=pattern]\n' +
                    'example: !svclist type=website name=test*\n',
                '!SVC':     "!svc:  get the agent/watchdog status or start/stop the agent/watchdog\n" +
                    "usage: !svc [agent|watchdog] [status|start|stop]\n" +
                    "example1: !svc agent status\n" +
                    "example2: !svc agent start\n",
                '!TAIL': '!tail: show last N lines of the specified file\n' +
                    'usage: !tail <filename> [<n> [<regex>]]\n' +
                    'example1: !tail ..\\logs\\wrapper.log    -- show last 20 lines of wrapper.log\n' +
                    'example2: !tail ..\\logs\\wrapper.log 30 -- show last 30 lines of wrapper.log\n' +
                    'example3: !tail ..\\logs\\wrapper.log 30 snmp -- show lines of last 30 lines in wrapper.log\n' +
                    '          that contains substring "snmp"\n',
                '!TASKKILL': '!taskkill: kill specified process\n' +
                    'usage: !taskkill [<native options>] <processId>\n' +
                    'example1: !taskkill -9 12345        -- kill a linux process\n' +
                    'example2: !taskkill /F /PID 12345   -- kill a windows process\n',
                '!TASKLIST': '!tasklist: list process running\n' +
                    'usage: !tasklist [<native options>]\n' +
                    'example1: !tasklist                                     -- list all linux processes by running "ps -aex"\n' +
                    'example2: !tasklist /FI "imagename eq sbwinproxy.exe"   -- list windows task with imagename "sbwinproxy.exe"\n',
                '!TDETAIL': "!tdetail: show detail information of a collecting task\n" +
                    "usage: !tdetail <TASKID>\n" +
                    "example: !tdetail 12323209239991",
                '!TLIST': '!tlist: list all collecting tasks satisfing the given critirias\n' +
                    'usage: !tlist [h=xxx] [dsi=xxx] [es=xxx] [c=xxx]\n' +
                    'where h is hostname, dsi is datasource instance name, es is eventsource name, c is collector. \n' +
                    'h and dsi could be glob expression or regular expression\n' +
                    'example: !tlist c=wmi h=paz02sql* dsi=WinLogicDisk-*',
                '!UPGRADEPROXY': '!upgradeproxy: upgrade sbproxy using an uploaded sbproxy (by !put) or by specifying a source path\n' +
                    'usage: !upgradeproxy\n' +
                    'example1: !upgradeproxy\n',
                '!UPGRADESTATUS': '!upgradestatus: query agent upgrade process or force upgrade immediately\n' +
                    'usage: !upgradestatus [forceUpgrade=true|false]\n' +
                    'example1: !upgradestatus                       -- query agent upgrading status\n' +
                    'example2: !upgradestatus forceUpgrade=true     -- force agent upgrade immediately\n',
                '!UPLOADLOG': '!uploadlog: upload specified log file\n' +
                    'usage: !uploadlog <logfile\n' +
                    'example1: !uploadlog wrapper.log       - upload wrapper.log\n' +
                    'example2: !uploadlog wrapper.log.10    - upload wrapper.log.10\n' +
                    'example3: !uploadlog sbproxy.log.1     - upload sbproxy log\n',
                '!UPTIME': "!uptime: shows the agent uptime\n" +
                    "usage: !uptime\n" +
                    "example: !uptime",
                '!VBSCRIPT': "!vbscript: executing specified VB script\n" +
                    "usage: !vbscript <scriptPath>\n" +
                    "scriptPath is an absolute path or a path relative <agentRoot>/bin.\n" +
                    "example: !vbscript ../lib/test.vbs\n" +
                    "this example will executing $agentroot/lib/test.vbs",
                '!WINEVENT': '!winevent: collect Windows event log\n' +
                    'usage: !winevent [username=foo password=bar] [h=xxx] [es=xxx] [filter=true|false]\n' +
                    "If you don't give the username/password, the agent will use wmi.user/wmi.pass\n" +
                    "properties of the host.\n" +
                    "example: !winevent h=console.host2.sb.logicmonitor.net es=winevent filter=true  - list Windows event results log on the host\n",
                '!WMI': '!wmi: execute a wmi query against the given host and print the result\n' +
                    'usage: !wmi [username=foo password=bar] h=<host> <wmi query>\n' +
                    "If you don't give the username/password, the agent will use wmi.user/wmi.pass\n" +
                    "properties of the host.\n" +
                    "example: !wmi h=paz02sql002 select * from win32_operatingsystem",
                '!WMIMETHOD': '!wmimethod: call a wmi query against the given host and print the result\n' +
                    'usage: !wmimethod [username=foo password=bar] h=<host> method=XXX path=XXX [params=\"XXX\"]\n' +
                    "If you don't give the username/password, the agent will use wmi.user/wmi.pass\n" +
                    "properties of the host.\n" +
                    "params is the input parameters of the method, it's optional. The params is organized by JSON object format" +
                    "example: !wmimethod h=paz02sql002 method=GetAvailableVirtualSize path=win32_process.handle='1'",
                '!XEN': '!xen: query a xen server counter against the given host\n' +
                    'usage: !xen [username=foo password=bar] <host> <entityName> <entityType[host|cpu|pif|vm|vbd|vif|sr|pool]> [counter1 [counter2...]]\n' +
                    "If you don't supply username/password, the collector will use the host properties xen.user/xen.pass\n" +
                    "example: !xen 10.0.0.50 e88d16e8-c4df-ce14-8f06-cfd3bf831f95 vm memory_actual",
                '!CHECKSERVERCONNECTIVITY': '!checkServerConnectivity: check connectivity of a new santaba server <host> , include DNS, PING, TCP & HTTP' +
                    "example: !checkServerConnectivity demo.logicmonitor.com"

            };


        },
        addResult: function(cmd, result) {
            this._cmdEl=$("#debugCommand");
            this._cmdEl.val("");
            var resultEl = $('#debugResult');
            resultEl.val(resultEl.val()  +cmd + "\n"  + result + "\n\n>>");
            resultEl.scrollTop(resultEl[0].scrollHeight);
            this._cmdEl.val("");
        },
        _submit: function (e) {
            console.log("key press code"+ e.which);
            if(e.which!=13)
                return;
            this._onSave();

        },
        _onSave: function () {
            var input=$("#debugCommand");
            this.processCmd(input.val());

        },
        render: function () {
            var template = this.template || this.bodyTemplate;
            var data = this._prepareData();
            this.$('.dialog-body').html(template(data));
            this.addResult("","");
            return this;
        },
        processCmd: function(rawDebugCmd) {
            this._history.push( rawDebugCmd );
            var lines = rawDebugCmd.split( "\n" );

            var upCmd = lines[0].toUpperCase();
            var tokens = upCmd.split( " ", 2 );


            if ( tokens[0] == "HELP" ) {
                if ( tokens.length == 1 )
                    this.addResult( rawDebugCmd, this._HELPMSG );
                else {
                    var cmd = tokens[1].toUpperCase();
                    if ( !this._CMDHELPMSG.hasOwnProperty(cmd) ) {
                        this.addResult( rawDebugCmd, "Unknown command");
                    }
                    else {
                        this.addResult( rawDebugCmd, this._CMDHELPMSG[cmd] );
                    }
                }
                return;
            }
            else if ( tokens[0] == '!HISTORY') {
                var output = '';
                for ( var i=0; i<this._history.length; i++ ) {
                    var idx = i+1;
                    output += "" + idx + "\t" + this._history[i] + "\r\n";
                }
                this.addResult( rawDebugCmd, output);
                return;
            }
            this.blockUI.block({
                message: 'wait...'
            });

            var that = this;
            this._confirm(rawDebugCmd, function (err) {
                if (!err) {
                } else {
                    MessageBox.alert( err.status + ':' + err.errmsg, 'Error');
                }

            });
            that.blockUI.unBlock();
        },
        _confirm: function (cmdline, cb) {
            var _self=this;
            LM.rajax({
                type: 'get',
                url: modelUrls.debug+cmdline,
                success: function (response) {
                    cb(null, response.data);
                    console.log("=========debug result:"+modelUrls.debug);
                    _self.addResult(cmdline,response.data.value);
                },
                error: function (response) {
                    cb(response);
                }
            });
        },
        _getUPHistory: function (e) {
            if(e.which!=40)
                return;
            if ( this._history.length === 0 )
                return;
            if ( this._idx === 0 )
                this._idx = this._history.length - 1;
            else
                this._idx --;
            this._cmdEl=$("#debugCommand");
            this._cmdEl.val(this._history[this._idx]);
        },
        _getDownHistory: function (e) {
            console.log("=====down code"+ e.which);
            if(e.which!=38)
                return;
            if ( this._history.length === 0 )
                return;
            if ( this._idx == this._history.length - 1)
                this._idx = 0;
            else
                this._idx ++;
            this._cmdEl=$("#debugCommand");
            this._cmdEl.val(this._history[this._idx]);
        }
    });
});