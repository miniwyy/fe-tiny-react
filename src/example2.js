class App extends React.Component {
    constructor() {
        super();

        this.state = {
            value: 0,
        };

        setInterval(() => {
            this.setState({
                value: this.state.value + 1,
            });
        }, 1000);
    }

    render() {
        return (
            <div>
                {this.state.value}
            </div>
        );
    }
}

// new App();
ReactDOM.render(<App />, document.querySelector('#app'));
