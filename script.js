/**
 * Created by danh on 10/18/16.
 */
var cell_template = function(parent){
    var self = this;
    this.parent = parent;
    this.element = null;
    this.symbol = null;
    this.create_self = function(){
        this.element = $("<div>",
            {
                class:'ttt_cell',
                html: '&nbsp;'
            }
        ).click(this.cell_click);
        return this.element;
    };
    this.cell_click = function(){
        if(self.element.hasClass('selected')){
            return;
        }
        //console.log('this cell clicked',self.element);
        var current_player = self.parent.get_current_player();
        self.symbol = current_player.get_symbol();
        console.log('current player\'s symbol: '+self.symbol);
        self.element.addClass('selected');
        self.change_symbol(self.symbol);
        self.parent.cell_clicked(self);
    };
    this.change_symbol = function(symbol){
        self.element.text(symbol);
    };
    this.get_symbol = function(){
        return self.symbol;
    };
};



var game_template = function(main_element){
    //console.log('game template constructor called');
    var self = this;
    this.element = main_element;
    this.cell_array = [];
    this.players = [];
    this.current_player = 0;
    //   0    1    2
    //   3    4    5
    //   6    7    8
    this.win_conditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];
    this.create_cells = function(cell_count){
        //console.log('game template create cells called');
        for(var i=0; i<cell_count; i++){
            var cell = new cell_template(this);
            var cell_element = cell.create_self();
            this.cell_array.push(cell);
            this.element.append(cell_element);
        }
    };
    this.create_players = function(){
        var player1 = new player_template('X', $('#player1'));
        var player2 = new player_template('O', $('#player2'));
        this.players.push(player1);
        this.players.push(player2);
        this.players[0].activate_player();
    };
    this.switch_players = function(){
        //console.log('current player before '+this.current_player);
        if(this.current_player){
            this.current_player=0;
        } else{
            this.current_player=1;
        }
        //console.log('current player before '+this.current_player);
    };
    this.get_current_player = function(){
        //console.log('current player is ',this.players);
        return this.players[this.current_player];
    };
    this.cell_clicked = function(clicked_cell){
        self.check_win_conditions();
        self.players[self.current_player].deactivate_player();
        self.switch_players();
        self.players[self.current_player].activate_player();

    };
    this.check_win_conditions = function(){
        //console.log('check win conditions called');
        var current_player_symbol = this.players[this.current_player].get_symbol();

        for(var i=0; i<this.win_conditions.length;i++){

            var count=0;
            //console.log('checking win conditions ',this.win_conditions);

            for(var j=0; j<this.win_conditions[i].length; j++){

                if(this.cell_array[this.win_conditions[i][j]].get_symbol() == current_player_symbol){
                    console.log('symbols match');
                    count++;
                    if(count==3){
                        console.log('someone won'); this.player_wins(this.players[this.current_player]);
                    }//end of count == 3
                } //end of symbols match
            } //end of inner loop
        } //end of outer loop
        //TODO check conditions
    };
    this.player_wins = function(player){
        console.log(player.get_symbol()+' won the game');
        alert(player.get_symbol()+' won the game');
    };
};

var player_template = function(symbol, element){
    //console.log('player constructor called');
    this.symbol = symbol;
    this.element = element;
    this.activate_player = function(){
        //console.log('activate player called');
        this.element.addClass('active_player');
    };
    this.deactivate_player = function(){
        this.element.removeClass('active_player');
    };
    this.get_symbol = function(){
        return this.symbol;
    };
};




var main_game = null;
$(document).ready(function(){
    apply_click_handlers()
    main_game = new game_template($('#gamebody'));
    main_game.create_cells(9);
    main_game.create_players();
});

function apply_click_handlers() {
    $("#submit").click(function(){
        var board_size = $("#board_size option:selected").val();
       console.log("board_size is ",board_size);

        var cell_width = 100/board_size;
        cell_width = cell_width.toFixed(2);
        cell_width = cell_width + "%";
        console.log("Cell width is " + cell_width);
        $("#gamebody").html("");
        main_game = new game_template($('#gamebody'));
        main_game.create_cells(board_size*board_size);
        main_game.create_players();
        $(".ttt_cell").css("width",cell_width);
        $(".ttt_cell").css("height",cell_width);
    });
}