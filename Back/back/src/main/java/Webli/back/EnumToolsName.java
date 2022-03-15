package Webli.back;

public enum EnumToolsName {

	JOHN_THE_REAPER("john the reaper");

	private String description;
	
	EnumToolsName(String description) {
		this.description = description;
	}
	
	public String getDescription() {
		return description;
	}
}
