import rm.managers.SceneManager;
import pixi.interaction.EventEmitter;
import core.Amaryllis;
import rm.Globals;

using Lambda;
using core.StringExtensions;
using core.NumberExtensions;
using StringTools;
using utils.Fn;

typedef LParams = {
  var backgroundImageName: String;
  var caseFileFontSize: Int;
}

@:native('LunaRogue')
@:expose('LunaRogue')
class Main {
  public static var Params: LParams = null;
  public static var listener: EventEmitter = Amaryllis.createEventEmitter();

  public static function main() {
    var plugin = Globals.Plugins.filter((plugin) -> ~/<LunaRogueEngine>/ig.match(plugin.description))[0];
    Params = {
      backgroundImageName: plugin.parameters['backgroundImageName'],
      caseFileFontSize: Fn.parseIntJs(plugin.parameters['caseFileFontSize'])
    }
  }

  public static function params() {
    return Params;
  }
}
