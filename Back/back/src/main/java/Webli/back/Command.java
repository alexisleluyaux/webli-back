package Webli.back;

import org.json.JSONObject;

public class Command {

	private EnumToolsName tools;
	private String command;
	private JSONObject result;
	
	public Command(EnumToolsName tools, String command) {
		this.tools = tools;
		this.command = command;
		this.result = null;
	}
	
	public EnumToolsName getTools() {
		return tools;
	}
	
	public void setTools(EnumToolsName tools) {
		this.tools = tools;
	}
	
	public String getCommand() {
		return command;
	}
	
	public void setCommand(String command) {
		this.command = command;
	}
	
	public JSONObject getResult() {
		return result;
	}
	
	public void setResult(JSONObject result) {
		this.result = result;
	}
}
