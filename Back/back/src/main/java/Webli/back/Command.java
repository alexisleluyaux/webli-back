package Webli.back;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.json.JSONObject;
import org.json.JSONString;

public class Command {

	private static final String BASH_ENVIRONMENT = "bash";
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
	
	public JSONObject runCommand() {
		ProcessBuilder processBuilder = new ProcessBuilder();
		processBuilder.command(BASH_ENVIRONMENT, this.command);
		try {
			Process process = processBuilder.start();
			StringBuilder output = new StringBuilder();
			BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
			String line;
			while ((line = reader.readLine()) != null) {
				output.append(line + "\n");
			}
			this.setResult(stringBuildertoJson(output));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return this.result;
	}
	
	public static JSONObject stringBuildertoJson (StringBuilder sb) {
		JSONObject result = new JSONObject();
		if (sb != null) {
			result.put("result",sb.toString());
		}
		return result;
	}
}
